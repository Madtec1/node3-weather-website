const request=require('request')

const forecast=(latitude,longitude, callback)=>{
    const url='http://api.weatherstack.com/current?access_key=78fc4f123a0560781aa670cc0aea1624&query='+latitude+','+longitude+'&units=f'

    console.log(url)
//const url='http://api.weatherstack.com/current?access_key=78fc4f123a0560781aa670cc0aea1624&query='
    request({ url:url,json:true }, (error, {body})=>{  
        if(error){
            callback('Unable to connect to weather service!', undefined)
        }else if(body.error){
            callback('Unable to find location', undefined)
        }
        else{
            const temperature=body.current.temperature
            const feelslike=body.current.feelslike
            const wind_speed=body.current.wind_speed
            callback(undefined,body.current.weather_descriptions[0]+'. It is currently '+ temperature+' degrees out. It feels like '+feelslike+' degrees out. Pressure is '+wind_speed)
        }
    })
}
module.exports=forecast