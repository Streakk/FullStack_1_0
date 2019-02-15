// /client/App.js
import React, { Component } from "react";
import axios from "axios";

class App extends Component {
  // initialize state 
  state = {
    data: [],
    id: 0,
    message: null,
    firstName: null,
    lastName: null,
    address: null,
    username: null,
    zipCode: null,
    password: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null
  };

 // did component mount
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });

    }
  }

// unmount component
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  
  // fetch data from the data base
  getDataFromDb = () => {
    fetch("http://localhost:3001/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

  //put method 
  putDataToDB = (message, firstName, lastName, address, username, password) => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post("http://localhost:3001/api/putData", {
      id: idToBeAdded,
      message: message,
      firstName: firstName,
      lastName: lastName,
      address: address,
      username: username,
      password: password,
    });
  };


  //delete method 
  deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id == idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete("http://localhost:3001/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };


  //update method 
  updateDB = (idToUpdate, firstName, lastName, address, username) => {
    let objIdToUpdate = null;
    this.state.data.forEach(dat => {
      if (dat.id == idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });
    fetch("https://postit.lt/data/?term=" + address + ",+Vilnius&key=kCyqzcxCgyAbglGGU9V2")
      .then(data => data.json())
      .then(res => this.setState({ zipCode: res.data[0].post_code }));


    console.log(this.state.zipCode, "POST CODE");
    axios.post("http://localhost:3001/api/updateData",  {
      id: objIdToUpdate,
      update: { firstName : firstName, lastName: lastName, address:address, username: username, zipCode:this.state.zipCode}
    });
  };


  //UI
  render() {
    const { data } = this.state;
    return (
      <div>
        <div style={{ padding: "10px" }}>
          <input
            type="text"
            onChange={e => this.setState({ message: e.target.value })}
            placeholder="Country"
            style={{ width: "200px" }}
          />
        </div>
        <div style={{ padding: "10px" }} >
          <input
            type="text"
            onChange={e => this.setState({ firstName: e.target.value })}
            placeholder="First Name"
            style={{ width: "200px" }}
          />
        </div>
        <div style={{ padding: "10px" }}>
          <input
            type="text"
            onChange={e => this.setState({ lastName: e.target.value })}
            placeholder="Last Name"
            style={{ width: "200px" }}
          />
        </div>
        <div style={{ padding: "10px" }}>
          <input
            type="text"
            onChange={e => this.setState({ address: e.target.value })}
            placeholder="Address"
            style={{ width: "200px" }}
          />
        </div>
        <div style={{ padding: "10px" }}>
          <input
            type="text"
            onChange={e => this.setState({ username: e.target.value })}
            placeholder="Username"
            style={{ width: "200px" }}
          />
        </div>
        <div style={{ padding: "10px" }}>
          <input
            type="password"
            onChange={e => this.setState({ password: e.target.value })}
            placeholder="Password"
            style={{ width: "200px" }}
          />
        </div>
        <div style={{ padding: "10px" }}>
        <button onClick={() => this.putDataToDB(this.state.message, this.state.firstName, this.state.lastName, this.state.address, this.state.username, this.state.password)}>
            ADD
          </button>
        </div>
        <div style={{ padding: "10px" }}>
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ idToDelete: e.target.value })}
            placeholder="id of item to delete"
          />
          <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
            DELETE
          </button>
        </div>
        <div style={{ padding: "10px" }}>
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ idToUpdate: e.target.value })}
            placeholder="id of item to update"
          />
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ firstName: e.target.value })}
            placeholder="FirstName"
          />
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ lastName: e.target.value })}
            placeholder="LastName"
          />
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ address: e.target.value })}
            placeholder="Adress"
          />
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ username: e.target.value })}
            placeholder="Username"
          />
          
          <button
            onClick={() =>
              this.updateDB(this.state.idToUpdate, this.state.firstName, this.state.lastName, this.state.address, this.state.username)
            }
          >
            UPDATE
          </button>
        </div>
        <ul>
          {data.length <= 0
            ? "NO DATABASE ENTRIES YET"
            : data.map(dat => (
                <li style={{ padding: "10px" }} key={data.message}>
                  <span style={{ color: "gray" }}> id: </span> {dat.id} <br/>
                  <span style={{ color: "gray" }}> First Name: </span>{dat.firstName}<br/>
                  <span style={{ color: "gray" }}> Last Name: </span>{dat.lastName}<br/>
                  <span style={{ color: "gray" }}> Address: </span>{dat.address}<br/>
                  <span style={{ color: "gray" }}> Username: </span>{dat.username}<br/>
                  {/* <span style={{ color: "gray" }}> ZipCode: </span>{dat.zipCode}<br/> */}
                </li>
              ))}
        </ul>
      </div>
    );
  }
}

export default App;