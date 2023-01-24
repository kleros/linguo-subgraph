#!/bin/bash

NETWORK_NAME=
SUBGRAPH_NAME=
TEMP=`getopt -o n:s: --long network:,subgraph-name: -n 'deploy.sh' -- "$@"`

if [ $? != 0 ]; then
    echo "Error: getopt command failed"
    exit 1
fi

eval set -- "$TEMP"

while true; do
  case "$1" in
    -n | --network )
      NETWORK_NAME="$2"
      shift 2
      ;;
    -s | --subgraph-name )
      SUBGRAPH_NAME="$2"
      shift 2
      ;;
    -- )
      shift
      break
      ;;
    * )
      break
      ;;
  esac
done

if [ -z "$NETWORK_NAME" ]; then
  echo "Error: network name not provided. Usage: ./deploy.sh --network [network_name]"
  exit 1
fi

if [ -z "$SUBGRAPH_NAME" ]; then
  echo "Error: subgraph project name not provided. Usage: ./deploy.sh --subgraph-name [subgraph_name]"
  exit 1
fi

if echo "$TESTNET_NETWORKS" | grep -qw "$NETWORK_NAME" ; then
    echo "Deploying to testnet: $NETWORK_NAME"
    # prepare subgraph for deployment
    yarn build:prepare "$NETWORK_NAME" && yarn build "$NETWORK_NAME"
    # authorize and deploy subgraph
    yarn auth "$SUBGRAPH_AUTH_TOKEN"
    yarn deploy:testnet "$SUBGRAPH_NAME"

elif echo "$PRODUCTION_NETWORKS" | grep -qw "$NETWORK_NAME" ; then
    echo "Deploying to production network: $NETWORK_NAME"
    # run deploy-mainnet script
     yarn build:prepare "$NETWORK_NAME" && yarn build "$NETWORK_NAME"
    # graph deploy --network "$NETWORK_NAME" --node https://api.thegraph.com/deploy/ gratestas/linguo-gnosis

else
    echo "Error: Invalid network name provided"
    exit 1
fi