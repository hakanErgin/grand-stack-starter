import React, { Fragment } from 'react';
import gql from 'graphql-tag';
import { Redirect } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { Formik, Field, ErrorMessage } from 'formik';
import injectSheet from 'react-jss';

import { FORM_INPUTS } from '../constants/styleConstants';
import { colors } from '../constants/colors';
import { RegisterValidation } from '../form-validation/login';

const styles = {
  loginContainer: {
    width: 400,
    margin: [0, 'auto'],
  },
  header: {
    fontSize: 48,
    flex: [1, 0, 0],
    color: colors.orange,
    fontWeight: 200,
    marginTop: 0,
    textAlign: 'center',
    letterSpacing: 5,
  },
  centeredContainer: {
    display: 'flex',
    flex: [1, 0, 0],
    alignItems: 'center',
    flexDirection: 'column',
  },
  ...FORM_INPUTS,
};

const REGISTER = gql`
  mutation RegisterMutation($email: String!, $password: String!) {
    RegisterUser(email: $email, password: $password) {
      id
    }
  }
`;

const Register = ({ classes }) => {
  return (
    <div className={classes.loginContainer}>
      <h1 className={classes.header}>Register</h1>
      <Mutation mutation={REGISTER}>
        {(RegisterUser, { data }) => {
          if (data && !!data.RegisterUser.id) {
            return <Redirect to={{ pathname: '/login' }} />;
          }

          return (
            <Fragment>
              <Formik
                initialValues={{
                  email: '',
                  password: '',
                  confirmPassword: '',
                }}
                onSubmit={({ email, password }) => {
                  RegisterUser({
                    variables: { email, password },
                  });
                }}
                validationSchema={RegisterValidation}
              >
                {(props) => (
                  <form
                    onSubmit={props.handleSubmit}
                    className={classes.centeredContainer}
                  >
                    <label className={classes.label}>
                      <span>Email</span>
                      <Field
                        type="email"
                        name="email"
                        placeholder="Email"
                        className={classes.formField}
                      />
                      <ErrorMessage name="email" />
                    </label>
                    <label className={classes.label}>
                      <span>Password</span>
                      <Field
                        type="password"
                        name="password"
                        placeholder="Password"
                        className={classes.formField}
                      />
                      <ErrorMessage name="password" />
                    </label>
                    <label className={classes.label}>
                      <span>Confirm Password</span>
                      <Field
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        className={classes.formField}
                      />
                      <ErrorMessage name="confirmPassword" />
                    </label>
                    <button type="submit" className={classes.button}>
                      Submit
                    </button>
                    <br />
                    <a href="/login">Go to login</a>
                  </form>
                )}
              </Formik>
            </Fragment>
          );
        }}
      </Mutation>
    </div>
  );
};

export default injectSheet(styles)(Register);
