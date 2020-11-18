const path=require('path')
const express=require('express')
const hbs=require('hbs')
const geocode=require('./utils/geocode')
const forecast=require('./utils/forecast')
console.log(__dirname)
console.log(path.join(__dirname,'../public'))
const app=express()
const port=process.env.PORT || 3000


//Define paths for express config
const publicDirectoryPath=path.join(__dirname,'../public')
const viewsPath=path.join(__dirname, '../templates/views')
const partialPath=path.join(__dirname,'../templates/partials')


//Setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialPath)


//Setup static directory to server
app.use(express.static(publicDirectoryPath))

app.get('',(req, res)=>{ //il primo argomento e' empty perche' va in homepage
    res.render('index',{
        title:'Weather App',
        name:'Alberto'
    })
})

app.get('/help',(req,res)=>{
    res.render('help',{ 
        helpText:'This is some helpful text',
        title:'Help', 
        name:'Alberto'
     
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{ //about si rifersice ad about.hbs ma possiamo lasciare fuori l'extension
        title:'About me',
        name:'Alberto'
    })
})


app.get('/weather',(req, res)=>{
    if(!req.query.address){
        return res.send({
            error:'You must provide an address'
        })
    }
    geocode(req.query.address,(error, {latitude, longitude, location}={})=>{
        if(error){
            return  res.send({
                error:error
            })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return  res.send({
                    error:error
                })
            }
            res.send({
                forecast:forecastData,
                location:location
            })

        })
    })


})

app.get('/products',(req, res)=>{
    if(!req.query.search){
        return res.send({
            error:'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products:[]
    })
})

app.get('/help/*',(req, res)=>{
    res.render('404',{ //404 si rifersice ad about.hbs ma possiamo lasciare fuori l'extension.
    //poi gli devo passare tutti i parametri richiesti dalla pagina, come se fosse una funzione
        title:'404',
        name:'Alberto',
        errorMessage:'Help article not found'
    })
})

app.get('*',(req,res)=>{ //l'asterisco significa "anything else" quindi e' importante che arrivi alla fine cioe' dopo che ha gia' cercato tutti i possibili match prima
    res.render('404',{
        title:'404',
        name:'Alberto',
        errorMessage:'Page not found'
    })
})

//listen e' il metodo utilizzato per far partire il server. La porta 3000 e' quella comunemente utilizzata per development
app.listen(port,()=>{
    console.log('Server is up on port '+port)
})