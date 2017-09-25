import React from 'react';
import './HomeView.scss';

// Weather Widget Component
export const WEATHER_API_KEY = '79cc018cbab34afe9cd94754172509'
export const PLACES_API_KEY = 'AIzaSyBiDPZbUq13joiGg4wxa-I7TcbX5G1Y6K4'
export const proxyurl = 'https://galvanize-cors-proxy.herokuapp.com/'

export class WeatherWidget extends React.Component {
  constructor () {
    super()
    this.state = {
      location: '',
      country: '',
      temp: null,
      localTime: null,
      condition: '',
      icon: '',
      cloudPercentage: null,
      loading: false,
      imageUrl:
        'https://cdn.dribbble.com/users/658839/screenshots/2015006/city-illustration.png'
    }
  }

  componentDidMount () {
    this.getPhotoForCity('madrid')
    this.getWeatherForCity('madrid')
  }

  onCitySubmit (event) {
    if (event.keyCode === 13) {
      this.getPhotoForCity(event.target.value)
      this.getWeatherForCity(event.target.value)
    }
  }

  getWeatherForCity (city) {
    fetch(
      `https://api.apixu.com/v1/current.json? key=${WEATHER_API_KEY}&q=${city}`
    )
      .then(response => {
        if (response.status !== 200) {
          console.log(`Error fetching data. Respons:${response.status}`)
          return
        }
        response.json().then(data => {
          this.setState({
            location: data.location.name,
            country: data.location.country,
            temp: data.current.temp_c,
            localTime: data.location.localtime,
            condition: data.current.condition.text,
            icon: data.current.condition.icon,
            cloudPercentage: data.current.cloud
          })
        })
      })
      .catch(err => {
        console.log('Fetch Error :-S', err)
      })
  }

  getPhotoForCity (city) {
    this.setState({ loading: true })
    const url = `${proxyurl}https://maps.googleapis.com/maps/api/place/textsearch/json?query=${city}&key=${PLACES_API_KEY}`
    fetch(url)
      .then(response => {
        if (response.status !== 200) {
          console.log(
            `Error fetching data. Response places:${response.status}`
          )
          return
        }
        response.json().then(data => {
          const photoRef = data.results[0].photos[0].photo_reference
          const url = `${proxyurl}https://maps.googleapis.com/maps/api/place/photo?maxheight=300&photoreference=${photoRef}&key=${PLACES_API_KEY}`
          fetch(url)
            .then(response => {
              if (response.status !== 200) {
                console.log(
                  `Error fetching data from places API. Response:${response.status}`
                )
                return
              }
              response.blob().then(blob => {
                const objectURL = URL.createObjectURL(blob)
                this.setState({ imageUrl: objectURL, loading: false })
              })
            })
            .catch(err => {
              if (err) {
                console.log('Fetch Error Photo', err.message)
              }
            })
        })
      })
      .catch(err => {
        if (err) {
          console.log('Fetch Error Places', err.message)
        }
      })
  }

  getPhotoContainer () {
    const preloader = this.state.loading ? (
      <div className='overlay'>
        <div className='loader'>
          <img src='https://image.ibb.co/meRVm5/sun_1.png' />
        </div>
      </div>
    ) : null
    return (
      <div
        className='image'
        style={{ backgroundImage: `url(${this.state.imageUrl})` }}
      >
        {preloader}
      </div>
    )
  }

  getInfoContainer () {
    const { condition, temp, location, localTime } = this.state
    let content;
    if (this.state.location.length === 0) {
      content = null
    } else {
      content = (
        <div>
          <div className='temp'>
            <span className='value'>{temp}&deg;</span>
            <span>{condition}</span>
          </div>
          <div className='hr' />
          <div className='location'>
            <span className='city'>{location}</span>
            <span>{localTime}</span>
          </div>
        </div>
      )
    }
    return <div className='info'>{content}</div>
  }

  getLocationInput () {
    return (
      <div className='input'>
        <input
          className='search'
          type='search'
          placeholder='Search location'
          onKeyPress={() => this.onCitySubmit(event)}
        />
      </div>
    )
  }

  render () {
    return (
      <div>
        <div className='container'>
          {this.getPhotoContainer()}
          {this.getInfoContainer()}
        </div>
        {this.getLocationInput()}
      </div>
    )
  }
}

export default WeatherWidget
/*
React.render(
<WeatherWidget />,
	document.getElementById('root')
);
*/
