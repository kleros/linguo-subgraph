# linguo-subgraph
This repo defines a subgraph which is used by [Linguo](https://linguo.kleros.io/) - The First Decentralized Translation Platform.

#### TL;DR
Kleros Linguo allows users to request translations of documents or other text, and translators can then get assigned fr these requests to provide the translation services. The platform uses smart contracts to manage the bidding process and ensure that translators are fairly compensated for the conducted work. 

In the event of a dispute, Kleros Linguo uses the Kleros arbitration to resolve any disagreements. This allows for fair and impartial resolution of disputes, ensuring that both requesters and translators are treated fairly.

## Languages
Currently Linguo provides service for 9 language pairs:
* `en-es` - Spanish
* `en-fr` - French
* `en-zh` - Chinese
* `en-pt` - Portuguese
* `en-ja` - Japanese
* `en-ko` - Korean
* `en-ru` - Russian
* `en-tr` - Turkish
* `de-en` - German


## Deployments

Currently the subgraph is deployed only on Gnosis chain
### Gnosis (Hosted Service)
- [Subgraph explorer](https://thegraph.com/explorer/subgraph/kleros/linguo-gnosis)
- [Subgraph endpoints](https://api.thegraph.com/subgraphs/name/kleros/linguo-gnosis)

## The subgraph defintion
The subgraph codebase consists of
- `subgraph.yaml` - a YAML file including the subgraph manifest.

    In this file, `dataSources` include the Linguo smart contract specifications for each _language pair_ and one for `IArbitrator`, which must be linked to provide access to information related to appeals.

    Linguo smart contracts:
    * [Linguo_en_es](https://gnosisscan.io/address/0xa2bfff0553de7405781fe0c39c04a383f04b9c80)
    * [Linguo_en_fr](https://gnosisscan.io/address/0x464c84c41f3C25Ba5a75B006D8B20600A8777306)
    * [Linguo_en_zh](https://gnosisscan.io/address/0x0B928165A67df8254412483ae8C3b8cc7F2b4D36)
    * [Linguo_en_pt](https://gnosisscan.io/address/0xFE721DD8Ac8e47A4228A6147A25C65136f213EaA)
    * [Linguo_en_ja](https://gnosisscan.io/address/0x852550982e0984F9CCeF18a7276D35AFDc30242c)
    * [Linguo_en_ko](https://gnosisscan.io/address/0xD67C12734dC12240a6324Db63ccd426964B71Fe7)
    * [Linguo_en_ru](https://gnosisscan.io/address/0x44863f5b7AAb7ceE181C0d84E244540125eF7AF7)
    * [Linguo_en_tr](https://gnosisscan.io/address/0x1D48a279966f37385b4AB963530C6dC813b3A8Df)
    * [Linguo_de_en](https://gnosisscan.io/address/0xc3162705Af0e10108FF837E450A14669b2711129)
    
    IArbitrator
    * [xKlerosLiquid](https://gnosisscan.io/address/0x9C1dA9A04925bDfDedf0f6421bC7EEa8305F9002)
   


- `schema.graphql` - a GraphQL schema that defines what data is stored for Linguo subgraph, and how to query it via GraphQL.

    This file specifies the data structure for each entity and its relationships with other entities.
    
    Entities:
    * Task
    * Round
    * Evidence
    * MetaEvidence
    * Contribution
    
    The whole data model is structured and organized around the main entity - `Task` - to enable a quick and easy access to the current state of an individual translation instances or a collection of those.
    
    
- `linguo.ts` - AssemblyScript code that translates from the event data to the entities defined in the schema.

    Example:
    ```typescript
    export function handleTaskCreated(event: TaskCreatedEvent): void {
      const lang = getLangFromAddress(event.address);
      if (lang === null) {
        log.error('Language for Linguo deployment is not found. lang {}; contract {}', [lang, event.address.toHexString()]);
        return;
      }

      const taskId = `${lang}-${event.params._taskID}`;
      const task = Task.load(taskId);
      if (!task) {
        log.error('HandleTaskCreated: Task not found. taskID {}; contract {}', [taskId, event.address.toHexString()]);
        return;
      }

      task.requester = event.params._requester;
      task.creationTime = event.params._timestamp;

      const evidenceGroup = new EvidenceGroup(`${event.params._taskID}-${event.address.toHexString()}`);
      evidenceGroup.task = task.id;

      evidenceGroup.save();
      task.save();
    }
    ```
    This mapping and such will handle events related to the creation, assignment, challenge, and resolution of tasks. When these events fire, the mapping will save the relevant data into the subgraph. This will ensure that the subgraph is always up-to-date and reflects the latest state of the tasks.

## Build
1. Install depependencies
```
$ yarn
```

2. To use the entities that are defined in the mappings, you will need to generate them locally. The CLI will take entity definitions and generate the necessary files and code inside `/generated` in the root directory to enable the entities to be used in the mappings. This can be done using the command line
```
$ yarn codegen
```

**Caution**

   - It is important to note that whenever you make changes to the GraphQL schema or the ABIs included in the manifest, you will need to run code generation again. This will update the generated code to reflect the changes, ensuring that it is correct and will not cause issues when building or deploying the subgraph. Additionally, code generation must be performed at least once before building or deploying the subgraph, as the generated code is required for these tasks. 
  
  > In general, it is a good idea to run code generation regularly to ensure that the generated code is up-to-date and matches the current state of your subgraph.
  

3. Run a `build` command to check your code for syntax errors.
```
$ yarn build
```
If the build command is successful, a new `/build` folder will be created in the root directory. 


## Deploy to the Graph Explorer (Hosted Service)

### Authenticate
To deploy your subgraph to the Graph Explorer, use the Graph CLI's `deploy` command. Before running this command, you will need to copy the Access token for your account from the Graph Explorer. This token will be used to authenticate your deployment and allow you to deploy your subgraph to the Graph Explorer.
```
$ yarn run graph auth --product hosted-service <access-token>
```

### Deploy
```
$ yarn deploy
```
