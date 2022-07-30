import { gql } from "@apollo/client"

export const GET_ASSIGNMENT = gql`
    query getAssignment($smallCapital: String!, $largeCapital: String!) {
        organization(login: "Future-Innovation-Academy") {
            repositories(last: 19) {
                nodes {
                    name
                    description
                    pushedAt
                    resourcePath
                    README: object (expression: $largeCapital) {
                        ... on Blob {
                            text
                        }
                    }
                    readme: object (expression: $smallCapital) {
                        ... on Blob {
                            text
                        }
                    }
                }
            }
        }
    }
`