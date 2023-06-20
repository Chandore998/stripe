const fs = require('fs');
require("dotenv").config()




const stripe = require("stripe")(process.env.STRIPE_SECRET)

exports.createPaymentIntent = async (req , res ) =>{
    try
    {
        const token = await this.createToken()

        const paymentMethod = await stripe.paymentMethods.create({
          type: 'card',
          card: {
            token: token.id,
          },
        });

        const email = "test12@gmail.com"

        const existingCustomer = await stripe.customers.list({
          email: email,
          limit: 1,
        });

        
        let customer = existingCustomer.data[0] 
        
        if(!customer){
          customer = await stripe.customers.create({
            email: "test1@gmail.com",
          });
        }

        await stripe.paymentMethods.attach(paymentMethod.id, {
          customer: customer.id,
        });

          try{
            const paymentIntent = await stripe.paymentIntents.create({
                amount : 90000,
                currency: "eur",
                customer: customer.id,
                capture_method:'manual',
                payment_method_types: ["card"],
                application_fee_amount : 12000,
                transfer_data:{
                  destination : "acct_1NGJdX4DoOW6cE0D"
                },
                payment_method: paymentMethod.id,
            });
            if(paymentIntent){
                const s = await stripe.paymentIntents.confirm(paymentIntent.id);
                return res.status(200).json({message:"done"})
            }
          }
          catch(err){
            console.log(err)
          }
        
        return res.status(400).json({message: "something went wrong"})
    }catch(error){
        console.log(error)
        return res.status(400).json({ message : 'something went wrong'})
    }
}

exports.acceptPayment = async (req , res ) => {
   try{
    const { payId } = req.body

    const paymentIntent = await stripe.paymentIntents.capture(payId, {
      transfer_data: {
        amount: 90000 * 0.9 - 90000 * 0.0152,
      },
    });
    if(paymentIntent){
        return res.status(200).json(paymentIntent)
    }
    return res.status(400).json({message: "something went wrong"})
   }
   catch(error){
    return res.status(400).json({ message : 'something went wrong'})
   }
}


exports.createDriverAccount = async (req , res) =>{
    try{
        let accountLink
        const account = await stripe.accounts.create({ type: 'standard' });
        try
        {
            accountLink = await stripe.accountLinks.create({
                account: account.id,
                refresh_url: 'https://example.com/reauth',
                return_url: 'https://example.com/return',
                type: 'account_onboarding',
              });
        }
        catch(err){
            console.log(err,"err")
        }
        return res.status(200).json(accountLink)
    }
    catch(err){
            return res. status(400).json({message : err})
    }
}

exports.createToken = async () => {
  try
  {
    const token = await stripe.tokens.create({
      card: {
        number: '4000003480000005',
        exp_month: 4,
        exp_year: 2027,
        cvc: '321',
      },
    });

    return token;

  }
  catch(error){
    console.log(error)
  }
}

exports.test = async (req,res) => {
  try
  {
    
    const paymentIntent = await stripe.paymentIntents.capture("pi_3NGQ0gKLXhFeTTFh0e353ioj", {
      transfer_data: {
        amount: 50000,
      },
    });

    console.log(paymentIntent,"fdfjksdfjksdfsdjkfhasd")

    return res.status(200).json({message:"done"})

  }
  catch(error){
    console.log(error)
  }
}

exports.createAccount = async (req, res) =>{
  try
  {
   
    const filePath = req.files.photo[0].path
    const filePath2 = req.files.photo[1].path

    const file1 = await stripe.files.create(
      {
        purpose: 'identity_document',
        file: {
          data: fs.readFileSync(filePath),
          name: 'verification_document.jpg',
          type: 'application/octet-stream',
        },
      })

      const file2 = await stripe.files.create(
        {
          purpose: 'identity_document',
          file: {
            data: fs.readFileSync(filePath2),
            name: 'verification_document.jpg',
            type: 'application/octet-stream',
          },
        })
    
    const accountToken = await stripe.tokens.create({
      account: {
        business_type: 'individual',
        individual: {
          first_name: 'Jansed',
          email: 'lolije901x@soremap.com',
          last_name: 'Doefdcd',
          dob: {
            day: 12,
            month: 4,
            year: 1997
          },
          address: {
            city: 'Puteaux',
            country: 'FR',
            line1: '61 rue de Penthièvre',
            line2: '',
            postal_code: '92800'
          },
          phone: '+33756493548',
          verification: {
            document: {
              front: file1.id,
              back: file2.id
            },
          },
        },
        tos_shown_and_accepted: true,
      },
    });

    const account = await stripe.accounts.create({
      type: 'custom',
      email: 'lolije901x@soremap.com',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_profile: {
        mcc: 4121,
        url: 'https://www.uber.com/in/en/'
      },
      account_token: accountToken.id,
      external_account:{
        object: "bank_account",
        country: 'fr',
        currency: 'eur',
        account_holder_name: 'Jenny Rosen',
        account_holder_type: 'individual',
        account_number: 'FR1420041010050500013M02606'
      }
    }); 

    return res.status(200).json({ data : account})
  }
  catch(error){
    console.log(error)
    return res.status(400).json({ data : "" })
  }
}

exports.updateAccount = async (req , res) =>{
  try{
    console.log(req.body)
    const sig = req.headers['stripe-signature'];
    console.log(sig,"get")
    return res.status(200).json({message:"done"})
  }catch(err){
    return res.status(400).json({ message: err.message })
  }
}


exports.createPaymentIntents = async (req , res ) =>{
  try
  {
          const paymentIntent = await stripe.paymentIntents.create({
              amount : 90000,
              currency: "eur",
              customer: "cus_O2mGoSYWwpDtav",
              capture_method:'manual',
              payment_method_types: ["card"],
              // application_fee_amount : 12000,
              transfer_data:{
                destination : "acct_1NGcuC4Eg7pIITf6"
              },
              payment_method: req.body.id,
          });
          if(paymentIntent){
              const s = await stripe.paymentIntents.confirm(paymentIntent.id);
              return res.status(200).json({message:"done"})
          }
    
    return res.status(400).json({message: "something went wrong"})
  }
  catch(error){
      console.log(error)
      return res.status(400).json({ message : 'something went wrong'})
  }
}


exports.getAllcard = async (req , res) =>{
  try
  {
   
    const paymentMethods = await stripe.customers.listPaymentMethods(
      'cus_O2mGoSYWwpDtav',
      {type: 'card'}
    );

    return res.status(200).json({message:paymentMethods})
    }
  catch(err)
  {
    return res.status(400).json({message :"error"})
  }
}



exports.test1 = async (req, res) =>{
  try{

    const test = req.body.id
    const paymentIntent = req.body.payment
    if(test === 1){
      const te = await stripe.paymentIntents.capture(
        paymentIntent
      );

      const latestTransferGroupId = te.transfer_group

      const transfers = await stripe.transfers.list({
        transfer_group: latestTransferGroupId,
        limit: 1, // Adjust the limit as needed
      });
      
      for (const transfer of transfers.data) {
        await stripe.transfers.createReversal(transfer.id, {
          amount: transfer.amount, // Reverse the full amount of each transfer
        });
        await stripe.refunds.create({
          payment_intent: te.id,
          amount: transfer.amount -  transfer.amount * 0.1, // Specify the amount to refund (in the smallest currency unit)
        });
      }
    }
    else if(test === 2){
      const s = 90000 - 90000 * 0.5
      const te = await stripe.paymentIntents.capture(
        paymentIntent,{
          transfer_data:{
            amount : s
          }
        }
      );

      await stripe.refunds.create({
        payment_intent: te.id,
        amount: s - s * 0.1 , // Specify the amount to refund (in the smallest currency unit)
      });

    }
    else if(test === 3){

      const s = 90000 - 90000 * 0.5
      const te = await stripe.paymentIntents.capture(
        paymentIntent,{
          transfer_data:{
            amount : s
          }
        }
      );

    }

    return res.status(200).json({message:"done"})
    // with in 30 min return all amount
  }
  catch(error){
    console.log(error)
    return res.status(400).json({message :"error"})
  }
}

