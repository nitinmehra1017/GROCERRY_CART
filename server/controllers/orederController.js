import Order from "../models/order.js";
import Product from "../models/product.js";
import stripe from 'stripe';



//Place Order COD : /api/order/cod



export const  placeOrderCOD = async(req,res)=>{
    try {
        const {userId,items,address} = req.body;
        if(!address || !items.lengh===0 ){
            return json({success:false ,message : "Invalid data"});
        }

        //calculate amount using items
        let amount = await items.reduce(async(acc,item)=>{
            const product =await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        },0)

        //Add tax charge(2%)

        amount += parseFloat (amount*0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            PaymentType: "COD",
        })

        res.json({success:true , message:"Order Placed Sucessfully"})
        

    } catch (error) {
         console.log(error.message);
        res.json({success:false,message:error.message})
    }
}


//get Orders by UserId : /api/oredr/user


export const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId; // from middleware

        const orders = await Order.find({
            userId,
            $or: [{ PaymentType: "COD" }, { isPaid: true }]
        })
        .populate("items.product address")
        .sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};



// get all Orders (for seller / admin) : api/order/seller

export const getAllOrders = async (req,res)=>{
    try {
       
        const orders = await Order.find({
            $or: [{PaymentType:"COD"},{isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({success:true , orders});
    } catch (error) {
         console.log(error.message);
        res.json({success:false,message:error.message})
    }
}






//Place Order STripe : /api/order/stripe



export const  placeOrderStripe = async(req,res)=>{
    try {
        const {userId,items,address} = req.body;
        const {origin} =req.headers;



        if(!address || !items.lengh===0 ){
            return json({success:false ,message : "Invalid data"});
        }

        let productData =[];

        //calculate amount using items
        let amount = await items.reduce(async(acc,item)=>{
            const product =await Product.findById(item.product);
            productData.push({
                name:product.name,
                price:product.offerPrice,
                quantity:item.quantity,
            })
            return (await acc) + product.offerPrice * item.quantity;
        },0)

        //Add tax charge(2%)

        amount += parseFloat (amount*0.02);

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            PaymentType: "Online",
        })

        //stripe gateway initialise
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        //create line items for stripe
        const line_items = productData.map((item)=>{
            return {
                price_data :{currency:"usd" ,
                product_data:{name:item.name,},unit_amount: Math.floor(item.price +item.price* 0.02)*100

            },quantity:item.quantity,
        }});


        //create session
        const session =await stripeInstance.checkout.sessions.create({
            line_items,
            mode:"payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url:`${origin}/cart`,
            metadata:{
                orderId: order._id.toString(),
                userId,
            }
        })


        res.json({success:true , url:session.url});
        

    } catch (error) {
         console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

// // STRIPE WEBHOOK TO VERIFY PAYMENTS ACTION :/stripe

// export const stripeWebhooks = async (request,response)=>{

//      //stripe gateway initialise
//     const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

//     const sig =request.headers["stripe-signature"];
//     let event;
//     try {
//         event = stripeInstance.webhooks.constructEvent(
//             request.body,sig,process.env.STRIPE_WEBHOOK_SECRET
//         );

        
//     } catch (error) {
//         response.status(400).send(`Webhook error : ${error.message}`)
        
//     }
//     switch(event.type){
//         case "payment_intent.succeeded":{
//             const payment_intent =event.data.object;
//             const paymentIntentId = paymentIntent.id
//         }
//     }
// }

