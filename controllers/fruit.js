const express = require('express') 
const Fruit = require('../models/fruit')




const router = express.Router() 





router.use((req, res, next) => {
    if (req.session.loggedIn) {
next();
} else {
    
        res.redirect("/user/login");
}
    });


//Index
router.get('/', (req, res) => {

    Fruit.find({username: req.session.username}, (err, fruits, ) => {

        // res.json(fruits)
        res.render('fruits/index.ejs', { fruits, user:req.session.username })
    })
    
})

//New
router.get('/new', (req, res) => {
    res.render('fruits/new.ejs')
})


//Create
router.post('/', (req, res) => {
    
req.body.readyToEat = req.body.readyToEat === 'on' ? true : false
req.body.username = req.session.username

    Fruit.create(req.body, (err, createdFruit) =>{
        console.log('created' , createdFruit, err)
        res.redirect('/fruits')
    })
})


//Edit
router.get('/:id/edit', (req, res) => {

    const id = req.params.id
    Fruit.findById(id, (err, foundFruit) => {
        
        res.render('fruits/edit.ejs', { fruit: foundFruit })
    })
})


//Update
router.put('/:id', (req, res) => {
    
    req.body.readyToEat = req.body.readyToEat === 'on' ? true : false

    Fruit.findByIdAndUpdate(req.params.id, req.body, {new: true},(err, updatedFruit) => {
        console.log(updatedFruit)

        res.redirect(`/fruits/${req.params.id}`)
        
    })
})


//Show
router.get('/:id', (req, res)=>{

    Fruit.findById(req.params.id)
    .then((fruit)=> {
        res.render('fruits/show.ejs', {fruit})
    })
})



//Delete
router.delete('/:id', async (req, res) => {

    // Method 1
    // Fruit.findByIdAndDelete(req.params.id, (err, deletedFruit) => {
    //     console.log(err, deletedFruit)
    //     res.redirect('/fruits')
    // })

    // // Method 2
    // Fruit.findByIdAndDelete(req.params.id)
    // .then((deletedFruit) => {
    //     console.log(err, deletedFruit)
    //     res.redirect('/fruits')
    // })
    // .catch(err => console.log(err))


    // Method 3 async await

    const deletedFruit = await Fruit.findByIdAndDelete(req.params.id)

    if(deletedFruit){
        res.redirect('/fruits/')
    }
})

/////////////
///// export this router to use in other files
//////////////
module.exports = router
