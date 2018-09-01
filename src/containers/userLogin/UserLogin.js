import React, { Component } from 'react';
import { connect } from 'react-redux';
import { userLogin } from '../../actions/index';
import { viewFavoritesFetchCall } from '../../helpers'
import { addFavorites } from '../../actions/index';


class UserLogin extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: ''
    };
  }

  loginUser = async event => {
    event.preventDefault();
    const { email, password } = this.state;
    try {
      const response = await fetch('http://localhost:3000/api/users/', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      this.setState({
        email: '',
        password: ''
      });
      const data = await response.json();
      this.props.loggedInUser(data);
    } catch (error) {
      alert('fuckyou');
    }
    await this.viewFavoritesPage();
  };

  viewFavoritesPage = async () => {
    const user_id = this.props.id.data.id;
    const url = `http://localhost:3000/api/users/${user_id}/favorites`;
    const userFavoritesData = await viewFavoritesFetchCall(url);
    this.props.addFavoriteMovie(userFavoritesData);
    console.log(userFavoritesData)
  };


  handleInput = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  validateUserInputForm = () => {
    return this.state.email.length > 8 && this.state.password.length > 6;
  };

  render() {
    return (
      <div>
        <form onSubmit={this.loginUser}>
          <input
            type="email"
            placeholder="Enter Email"
            value={this.state.email}
            name="email"
            onChange={this.handleInput}
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={this.state.password}
            name="password"
            onChange={this.handleInput}
          />
          <button disabled={!this.validateUserInputForm()}>Login</button>
        </form>
        <button>Register</button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  id: state.loginUserReducer
})

const mapDispatchToProps = dispatch => ({
  addFavoriteMovie: favorite => dispatch(addFavorites(favorite)),
  loggedInUser: user => dispatch(userLogin(user))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserLogin);