import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading }, //deconstructed
  ...rest //grabs the rest of the stuff.
}) => (
  <Route
    {...rest}
    render={props =>
      !isAuthenticated && !loading ? ( //if not authenticated and not loading
        <Redirect to='/login' /> //go here.
      ) : (
        <Component {...props} /> //Else?  Go here.
      )
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const manStateToProps = state => ({
  auth: state.auth
});

export default connect(manStateToProps)(PrivateRoute);
