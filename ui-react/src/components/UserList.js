import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const GET_USER = gql`
  query {
    User {
      email
      password
    }
  }
`;

function UserList(props) {
  const { loading, data, error } = useQuery(GET_USER);

  return (
    <div>
      {data && !loading && !error && (
        <div>
          {data.User.map((n, index) => {
            return (
              <div key={index}>
                email {n.email} , password {n.password}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default UserList;
