const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
var Sequelize = require("sequelize");
var dbConfig = require("./db.config");


const app = express();

app.use(cors());
app.use(bodyparser.json());

var sequelize = new Sequelize(dbConfig.DB,dbConfig.USER,dbConfig.PASSWORD,{
    host:dbConfig.HOST,
    dialect:dbConfig.dialect,
    pool:{
        min:dbConfig.pool.min,
        max:dbConfig.pool.max,
        acquire:dbConfig.pool.acquire,
        idle:dbConfig.pool.idle

    }
});

// sequelize.authenticate().then(()=>{
//         console.log("connected to the databases successfully");
//     }).catch(err=>{
//         console.error("unable to connect"+err);
//     }).finally(()=>{
//         sequelize.close();
//     })
let InsuranceTable = sequelize.define('Insurance',{
        Insurance_ID:{
            primaryKey:true,
            type:Sequelize.INTEGER
        },
        policyName:Sequelize.STRING,
        policyAmt:Sequelize.INTEGER,
        M_amt:Sequelize.INTEGER,
        nominee:Sequelize.STRING
    },{
        timestamps:false,
        freezeTableName:true
    });

    // InsuranceTable.sync().then(()=>{
    //         console.log("table is created ");
    //     }).catch((err)=>{
    //         console.error("error is "+err);
    //     }).finally(()=>{
    //         sequelize.close();
    //     })

    // InsuranceTable.create({
    //     Insurance_ID:101,
    //     policyName:"Varun",
    //     policyAmt:20000,
    //     M_amt:4000,
    //     nominee:"Navnath"
    //     }).then((data)=>{
    //         console.log("record is inserted ....");
    //     }).catch((err)=>{
    //         console.error("error is :"+err);
    //     });


    app.get('/',(req,res)=>{
        console.log("working fine");
        res.send("working with 8000 port")
    })
    app.get('/insurance',(req,res)=>{
        InsuranceTable.findAll({raw:true}).then(data=>{
            console.log(data);
            res.status(200).send(data);
    
        }).catch(err=>{
            console.error("error is :"+err);
            res.status(400).send(err);
        })
    })
    app.get('/insuranceByID/:id',(req,res)=>{
        const id = req.params.id;
        console.log(id);

        InsuranceTable.findByPk(id,{raw:true}).then(data=>{
            console.log(data);
            res.status(400).send(data);

        }).catch(err=>{
            console.log(err);
            res.status(200).send(err);
        })
    })
    
    app.get('/InsuranceByName/:policyname',(req,res)=>{
        var policyname = req.params.policyname;
        console.log("given id is :"+policyname);
        
        InsuranceTable.find({policyname: 'policyname'},function (err, policyname) {res.json(policyname);}) 
    .then(data=>{
            console.log(data);
            res.status(200).send(data);
        }).catch(err=>{
            console.error("error is :"+err);
            res.status(400).send(err);
        })
    })

    app.use(express.json());
app.post("/insertData",(req,res)=>{
    var Insurance_ID = req.body.Insurance_ID;
    var policyName = req.body.policyName;
    var policyAmt = req.body.policyAmt;
    var M_amt = req.body.M_amt;
    var nominee = req.body.nominee;

    var insObj = InsuranceTable.build({Insurance_ID:Insurance_ID,policyName:policyName,policyAmt:policyAmt,M_amt:M_amt,nominee:nominee});
    insObj.save().then(data=>{
        var strMsg = 'record is inserted ';
        res.status(201).send(strMsg);
    }).catch(err=>{
        console.error("error is :"+err);
        res.status(400).send(err);
    })
})
//update the records by id
app.put("/updateData",(req,res)=>{
    var Insurance_ID = req.body.Insurance_ID;
    var policyName = req.body.policyName;
    var policyAmt = req.body.policyAmt;
    var M_amt = req.body.M_amt;
    var nominee = req.body.nominee;

    var insObj = InsuranceTable.update(
        {Insurance_ID:Insurance_ID,
            policyName:policyName,
            policyAmt:policyAmt,
            M_amt:M_amt,
            nominee:nominee},
        {where:{Insurance_ID:Insurance_ID}
    }).then(data=>{
            console.log("data");
            var strmsg = "data updated......";
            res.status(201).send(strmsg);
        }).catch(err=>{
            console.error("there is an error :"+err);
            res.status(400).send(err);
        })

});

app.delete("/deleteData/:id",(req,res)=>{
    console.log("enter deleteby the id");
    var id =req.params.id;
    console.log("given id is :"+id);

    InsuranceTable.destroy({where:{Insurance_ID:id}}).then(data=>{
        console.log(data);
        var strMsg = "record is deleted now..";
        res.status(200).send(strMsg);
    }).catch(err=>{
        console.error("there is some error :"+err);
        res.status(400).send(err);
    })
})


app.post("/loginpage",(req,res)=>{
    console.log("logging into web page");
    var uid = req.query.uid;
    var pass = req.query.password;

    console.log(`the give UID :${uid} and password is :${pass}`);
    if (uid=="navnath" && pass=="admin")
    {
        res.send("your valid user");
    }
    res.send("Not valid crediantial please enter valid uid and password")

});
app.listen(8000,()=>{
    console.log("server is listening at 8000");
});