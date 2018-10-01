$(document).ready(function(){
  $("#getWeatherForcast").click(function(){
      var key = '7971da2c33900f0d8c296e7e56583771';
      var city = $("#city").val();
    
      
      $.ajax({
        url: 'https://api.openweathermap.org/data/2.5/weather',
        type: 'GET',      
        dataType: 'json',
        data: {appid: key, q:city, units: 'metric'},

        success: function(data){
          var cel = '';
          $.each(data.weather, function(index,val) {
              cel += '<b><center>' + data.name + "</b><img src=" + val.icon +
                ".png><center>"+
               data.main.temp + '&deg;C '+ ' | ' + val.main + " , " +
               val.description
          });
          $("#showWeatherForcast").html(cel);
        }
        });
        
        function getLatLong(){
          $.ajax({
            url: "https://geoip-db.com/json/",
            type: 'GET',
            dataType: 'json',
            data: {appid: key, q:city, units: 'metric'},
            
            success: function(data){
              var lat = data.latitude;
              var long = data.longitude;
              getlatlong();
              $('.city').html(data.city);
              
              key += "?lat="+lat+"&lon="+long+"&APPID="+key+"&units=metric";
              getWeatherData();
            },
            error: function(error) {
              alert('There are some wrong, Please try again.');
              console.log(error);
            }
          });
        }
    });
});
