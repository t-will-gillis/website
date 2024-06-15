name: GraphQL Check Status
on: 
  workflow_dispatch:

jobs:
  Get-Nodes:
    runs-on: ubuntu-latest
    steps:

      - name: Get project data
        env:
          GH_TOKEN: ${{ secrets.GRAPHQL }}
          USER: "t-will-gillis"
          PROJECT_NUMBER: 5

        run: |
          gh api graphql -f query='
            query {
              repository(owner:"t-will-gillis", name:"website") {
                pullRequest(number:782){
                  reviews(last:5){
                   nodes{
                    state,
                    url, author{login},
                    createdAt,
                   }
                 }
                  commits(last:1){
                    nodes{
                      commit{
                        status{
                          state
                          contexts{
                            state,
                            context,
                            description,
                            createdAt,
                            targetUrl
                          }
                        }
                      }
                    }
                  }
                }
              }
        }
            }'
