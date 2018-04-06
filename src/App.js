import React, { Component } from 'react';
import './App.css';
import photos from './response.json';


const PLACES = [
  {name: 'Москва', id: '524901'},
  {name: 'Уфа', id: '479561'},
  {name: 'Кубинка', id: '540030'},
  {name: 'Актюбинск', id: '1526586'}
]


class WeatherText extends Component {
  constructor() {
    super();
    this.state = {
      weatherData: null,
      forecastData: null
    }
  }
  componentDidMount() {
    const name = this.props.city.name;
    const id = this.props.city.id;
    const currentURL = 'http://api.openweathermap.org/data/2.5/weather?id=' + id + 
             '&appid=756b92f7d4a492a9bfae2d59dd531d0f&units=metric&lang=ru';
    const forecastURL = 'http://api.openweathermap.org/data/2.5/forecast?id=' + id + 
             '&appid=756b92f7d4a492a9bfae2d59dd531d0f&units=metric&lang=ru'
    fetch(currentURL)
      .then(result => result.json())
      .then(json => {this.setState({weatherData: json})})
    fetch(forecastURL)
      .then(result => result.json())
      .then(json => {this.setState({forecastData: json})})
  }
  render() {
    const weatherData = this.state.weatherData;
    const forecastData = this.state.forecastData;

    let currentHour = new Date().getHours();
    let extractHours = /[0-9][0-9](?=\:)/;

    if (!weatherData) return <p>Loading...</p>;
    if (!forecastData) return <p>Loading...</p>; 

    let nearestTime, nextTime;

    let calc = function(time) {
      if(time == '00') {
        return 24 - currentHour;
      } else {
        return Number(time) - currentHour;
      }
    }

    let definition = function(time) {
      if (time == '03') {
        return 'часа';
      } else if (time == '21') {
        return 'час';
      } else {
        return 'часов';
      }
    }

    let nearestTimeIndex = forecastData.list.findIndex((el) => {
      nearestTime = extractHours.exec(el.dt_txt);
      let result = calc(nearestTime);
      console.log(nearestTime)
      return (result > 0 && result <= 3);
    })

    let nextTimeIndex = forecastData.list.findIndex((el) => {
      nextTime = extractHours.exec(el.dt_txt);
      let result = calc(nextTime);
      return ((result > 3 && result <= 6) || (result >= -20 && result <= -18));
    })

    let nearestTimeDescr = definition(nearestTime);
    let nextTimeDescr = definition(nextTime);

    let nearestWeather = forecastData.list[nearestTimeIndex];
    let nextWeather = forecastData.list[nextTimeIndex];
    console.log(nearestWeather)

    return (
        <div>
          <h1 className = 'weatherHeader'>{this.props.city.name}</h1>
          <p className = 'currentWeather'>Сейчас {weatherData.weather[0].description} и {Math.floor(weatherData.main.temp)}° С</p>
          <p className = 'nearestWeather'>В {nearestTime} {nearestTimeDescr} будет {nearestWeather.weather[0].description} и {Math.floor(nearestWeather.main.temp)}° С, 
          а в {nextTime} {nextTimeDescr} - {nextWeather.weather[0].description} и {Math.floor(nextWeather.main.temp)}° C</p>
        </div>
    );
  }
}

class Weather extends Component {
  constructor() {
    super();
    this.state = {
      activePlace: 0
    }
  }
  render() {
    const activePlace = this.state.activePlace;
    return (
      <div class = 'weatherText'>
        <div className = 'citybuttons'>
            {PLACES.map((place,index) => (
              <button className = 'citybutton' key = {index} onClick = {() => {this.setState({activePlace: index})}}>{place.name}</button>
            ))}
        </div>
        <WeatherText key = {activePlace} city = {PLACES[activePlace]} />
      </div>
    );
  }
}


class Cats extends Component {
  constructor(){
    super();
    this.state = {
      images: null
    }
  }
  componentDidMount() {
      setTimeout(() => {
        this.setState({images: photos})
      },1000)
  }
  render() {
    if(!this.state.images) return <p>Loading...</p>
    let gallery = this.state.images;
    let length = gallery.data.length
    let randomNumber = Math.floor(Math.random()*(length - 0 + 1) + 0);
    let link = gallery.data[randomNumber].link;
    let alt = 'котик';
    return (
      <div className = 'image'><img  src = {link} alt = 'котик'/></div>
    );
  }
}

class TodoItems extends Component {
  constructor(props) {
    super(props);
    this.createTasks = this.createTasks.bind(this);
  }
  delete(key) {
    this.props.delete(key);
  }
  createTasks(item) {
    return <li  className = 'todoItem' 
                key = {item.key}>
              <p>{item.text}</p>
              <span className = 'todoDelete' onClick = {() => this.delete(item.key)}>x</span>
            </li>
  }
  render () {
    let todoEntries = this.props.entries;
    let listItems = todoEntries.map(this.createTasks);
    return (
      <ul className = 'todoList'>
        {listItems}
      </ul>
    )
  }
}

class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    }
    this.addItem = this.addItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  addItem(e) {
    if (this._inputElement.value !== '') {
      let newItem = {
        text: this._inputElement.value,
        key: Date.now()
      };

      this.setState((prevState) => {
        return {
          items: prevState.items.concat(newItem)
        };
      });

      this._inputElement.value = '';
    }

    console.log(this.state.items);

    e.preventDefault();
  }

  deleteItem(key) {
    let filteredItems = this.state.items.filter((item) => {
      return (item.key !== key);
    })

    this.setState({
      items: filteredItems
    })
  }
  render() {
    return (
      <div className = 'todoListMain'>
        <div className = 'todoHeader'>
          <h1>Очень Важный Список</h1>
          <form className = 'todoForm' onSubmit = {this.addItem}>
            <input  className = 'todoField'
                    ref = {(a) => this._inputElement = a}
                    placeholder = ''></input>
            <button className = 'todoButton' type = 'submit'>+</button>
          </form>
        </div>
        <div>
          <TodoItems entries = {this.state.items} delete = {this.deleteItem}/>
        </div>
      </div>
    );
  }
}

class Portal extends Component {
  constructor(){
    super();
    this.state = {
      activePlace: 0,
    }
  }
  render() {
    return (
      <div className = 'main'>
        <div className = 'third weather'>
          <Weather/>
        </div>
        <div className = 'third'>
          <Cats />
        </div>
        <div className = 'third'>
          <Todo />
        </div>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <Portal/>
      </div>
    );
  }
}

export default App;
