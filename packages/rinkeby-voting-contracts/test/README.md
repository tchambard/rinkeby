# Projet - Système de vote 2

## Tests unitaires

J'estime que la couverture de test est complète à 100%.  

La structure de test est composée de cinq sections principales:
- onlyOwner modifer prevents functions to be called by non owners
- onlyVoters modifier prevents functions to be called by non voters
- everybody can call public storage getters
- Voting actions are conditionned by voting session status
- A complete super heroes voting session

Les hooks sont organisés de façon à ce que n'importe quel `it` puisse être joué indémendemment du reste (avec un `.only`) en bénéficiant du strict minimum nécessaire au niveau setup.
J'utilise majoritairement des hooks `beforeEach` afin de m'assurer que chaque test est exécuté dans un contexte fraichement créé dans lequel je maitrise parfaitement les données présentes dans le storage de mon contrat.


- [VotingAlyra.spec.ts](./VotingAlyra.spec.ts) correspond aux tests unitaires du [contrat fourni par Alyra](https://github.com/lecascyril/CodesRinkeby/blob/main/voting.sol) ([commit](https://github.com/lecascyril/CodesRinkeby/commit/c9266381719810402e0616d967596d0e0692576d))
- BONUS: [Voting.spec.ts](./Voting.spec.ts) correspond aux tests unitaires du contrat que j'ai rendu au projet #1

## Intégration continue

- [Workflow](https://github.com/tchambard/rinkeby/blob/master/.github/workflows/ci.yml)
- [Un exemple de pipeline complet](https://github.com/tchambard/rinkeby/actions/runs/3332854856/jobs/5514199386)

## Typescript
Utilisation de [typechain](https://github.com/dethcrypto/TypeChain)

## Lint

Utilisation de [solhint](https://github.com/protofire/solhint)

## Eth-gas-reporter

L'utilisation de eth-gas-reporter est conditionné lors de l'exécution de la commande de lancement des tests par l'usage de la variable d'environnment `REPORT_GAS`.

## Coverage

Le coverage est fonctionnel après passage sur hardhat.

## Comment executer les tests

```sh
# Installer yarn
npm i -g yarn

# Cloner le repo
git clone https://github.com/tchambard/rinkeby.git
cd rinkeby/packages/rinkeby-voting-contracts

# Installer les dépendances
yarn install

# Compiler les contrats et générer les fichiers de types (optionnel)
yarn compile

# Exécuter le lint (optionnel)
yarn lint

# Exécuter les tests
yarn test
# ou pour ne jouer que les tests du contrat VotingAlyra
yarn test -- test/VotingAlyra.spec.ts

# Exécuter les tests avec les informations de consommation de gas
REPORT_GAS=true yarn test

# Exécuter le coverage
yarn coverage

```

## Output du coverage

```sh
------------------|----------|----------|----------|----------|----------------|
File              |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
------------------|----------|----------|----------|----------|----------------|
 contracts/       |    98.53 |    93.44 |     96.3 |    99.04 |                |
  Voting.sol      |    97.37 |    90.54 |    93.75 |    98.33 |            382 |
  VotingAlyra.sol |      100 |    97.92 |      100 |      100 |                |
------------------|----------|----------|----------|----------|----------------|
All files         |    98.53 |    93.44 |     96.3 |    99.04 |                |
------------------|----------|----------|----------|----------|----------------|
```

## Output des tests

```sh

  Contract: Voting
    > Some access controls prevent functions to be called by non owners
      > createVotingSession
        ✔ > should fail when called with registered voter address (43ms)
        ✔ > should fail when called with non registered voter address
      > registerVoter
        ✔ > should fail when called with registered voter address
        ✔ > should fail when called with non registered voter address
      > startProposalsRegistration
        ✔ > should fail when called with registered voter address
        ✔ > should fail when called with non registered voter address
      > stopProposalsRegistration
        ✔ > should fail when called with registered voter address
        ✔ > should fail when called with non registered voter address
      > startVotingSession
        ✔ > should fail when called with registered voter address
        ✔ > should fail when called with non registered voter address
      > stopVotingSession
        ✔ > should fail when called with registered voter address
        ✔ > should fail when called with non registered voter address
      > tallyVotes
        ✔ > should fail when called with registered voter address
        ✔ > should fail when called with non registered voter address
      > getVote
        ✔ > should fail when called with non registered voter or owner address
    > Voting actions are conditionned by voting session status
      ## voting status is RegisteringVoters
        > createVotingSession
          ✔ > should succeed when called with contract owner address
        > getVote
          ✔ > should fail when called with registered voter address
          ✔ > should fail when called with contrat owner address
        > registerVoter
          ✔ > should succeed when called with contrat owner address
          ✔ > should fail when voter address is already registered
          ✔ > should fail when voter address is owner contract address
        > startProposalsRegistration
          ✔ > should succeed when called with contrat owner address
        > stopProposalsRegistration
          ✔ > should fail when called with contrat owner address
        > startVotingSession
          ✔ > should fail when called with contrat owner address
        > stopVotingSession
          ✔ > should fail when called with contrat owner address
        > registerProposal
          ✔ > should fail when called with non registered voter address
          ✔ > should fail when called with registered voter address
          ✔ > should fail when called with contrat owner address
        > vote
          ✔ > should fail when called with registered voter address
          ✔ > should fail when called with non registered voter address
          ✔ > should fail when called with contrat owner address
        > tallyVotes
          ✔ > should fail when called with contrat owner address
        ## voting status is ProposalsRegistrationStarted
          > createVotingSession
            ✔ > should succeed when called with contract owner address
          > getVote
            ✔ > should fail when called with registered voter address
            ✔ > should fail when called with contrat owner address
          > registerVoter
            ✔ > should fail as session status is not RegisteringVoters
          > startProposalsRegistration
            ✔ > should fail when called with contrat owner address
          > stopProposalsRegistration
            ✔ > should succeed when called with contrat owner address
          > startVotingSession
            ✔ > should fail when called with contrat owner address
          > stopVotingSession
            ✔ > should fail when called with contrat owner address
          > registerProposal
            ✔ > should fail when called with non registered voter address
            ✔ > should succeed when called with registered voter address
            ✔ > should fail when called more times than maximum allowed (46ms)
            ✔ > should fail when called with contrat owner address
          > vote
            ✔ > should fail when called with registered voter address
          > tallyVotes
            ✔ > should fail when called with contrat owner address
          ## voting status is ProposalsRegistrationStopped
            > createVotingSession
              ✔ > should succeed when called with contract owner address
            > getVote
              ✔ > should fail when called with registered voter address
              ✔ > should fail when called with contrat owner address
            > registerVoter
              ✔ > should fail as session status is not RegisteringVoters
            > startProposalsRegistration
              ✔ > should fail when called with contrat owner address
            > stopProposalsRegistration
              ✔ > should fail when called with contrat owner address
            > startVotingSession
              ✔ > should succeed when called with contrat owner address
            > stopVotingSession
              ✔ > should fail when called with contrat owner address
            > registerProposal
              ✔ > should fail when called with registered voter address
            > vote
              ✔ > should fail when called with registered voter address
            > tallyVotes
              ✔ > should fail when called with contrat owner address
            ## voting status is VotingSessionStarted
              > createVotingSession
                ✔ > should succeed when called with contract owner address
              > getVote
                ✔ > should fail when called with registered voter address
                ✔ > should fail when called with contrat owner address
              > registerVoter
                ✔ > should fail as session status is not RegisteringVoters
              > startProposalsRegistration
                ✔ > should fail when called with contrat owner address
              > stopProposalsRegistration
                ✔ > should fail when called with contrat owner address
              > startVotingSession
                ✔ > should fail when called with contrat owner address
              > stopVotingSession
                ✔ > should succeed when called with contrat owner address
              > registerProposal
                ✔ > should fail when called with registered voter address
              > vote
                ✔ > should succeed when called with registered voter address
                ✔ > should fail when called with registered voter address that has already voted
                ✔ > should fail when called with registered voter address who votes for its own proposal
                ✔ > should fail when called with registered voter address who votes for abstention proposal
              > tallyVotes
                ✔ > should fail when called with contrat owner address
              ## voting status is VotingSessionEnded
                > createVotingSession
                  ✔ > should succeed when called with contract owner address
                > getVote
                  ✔ > should succeed when called with registered voter address
                  ✔ > should succeed when called with contrat owner address
                > registerVoter
                  ✔ > should fail as session status is not RegisteringVoters
                > startProposalsRegistration
                  ✔ > should fail when called with contrat owner address
                > stopProposalsRegistration
                  ✔ > should fail when called with contrat owner address
                > startVotingSession
                  ✔ > should fail when called with contrat owner address
                > stopVotingSession
                  ✔ > should fail when called with contrat owner address
                > registerProposal
                  ✔ > should fail when called with registered voter address
                > vote
                  ✔ > should fail when called with registered voter address
                > tallyVotes
                  ✔ > should succeed when called with contrat owner address
                ## voting status is VotesTallied
                  > createVotingSession
                    ✔ > should succeed when called with contract owner address
                  > getVote
                    ✔ > should succeed when called with registered voter address
                    ✔ > should succeed when called with contrat owner address
                  > registerVoter
                    ✔ > should fail as session status is not RegisteringVoters
                  > startProposalsRegistration
                    ✔ > should fail when called with contrat owner address
                  > stopProposalsRegistration
                    ✔ > should fail when called with contrat owner address
                  > startVotingSession
                    ✔ > should fail when called with contrat owner address
                  > stopVotingSession
                    ✔ > should fail when called with contrat owner address
                  > registerProposal
                    ✔ > should fail when called with registered voter address
                  > vote
                    ✔ > should fail when called with registered voter address
                  > tallyVotes
                    ✔ > should fail when called with contrat owner address
    > A complete super heroes voting session
      ✔ > should allow to get all registered voter addresses with events
      ✔ > should allow to get all registered proposal ids with events
      ✔ > should allow to get all voters addresses that have voted with events
      ✔ > should allow to get the voting session result with events
    > Many parallel voting sessions
      ✔ > should allow to get all registered voter addresses with events filtering on sessionId
      ✔ > should allow to get all registered proposal ids with events filtering on sessionId
      ✔ > should allow to get all voters addresses that have voted with events filtering on sessionId
      ✔ > should allow to get the voting session result with events filtering on sessionId

  Contract: VotingAlyra
    > onlyOwner modifer prevents functions to be called by non owners
      > addVoter
        ✔ > should fail when called with registered voter address
        ✔ > should fail when called with non registered voter address
      > startProposalsRegistering
        ✔ > should fail when called with registered voter address
        ✔ > should fail when called with non registered voter address
      > endProposalsRegistering
        ✔ > should fail when called with registered voter address
        ✔ > should fail when called with non registered voter address
      > startVotingSession
        ✔ > should fail when called with registered voter address
        ✔ > should fail when called with non registered voter address
      > endVotingSession
        ✔ > should fail when called with registered voter address
        ✔ > should fail when called with non registered voter address
      > tallyVotes
        ✔ > should fail when called with registered voter address (66ms)
        ✔ > should fail when called with non registered voter address
    > onlyVoters modifier prevents functions to be called by non voters
      > getVoter
        ✔ > should fail when called with non registered voter
        ✔ > should fail when called with contrat owner address
      > getOneProposal
        ✔ > should fail when called with non registered voter
        ✔ > should fail when called with contrat owner address
      > addProposal
        ✔ > should fail when called with non registered voter
        ✔ > should fail when called with contrat owner address
      > setVote
        ✔ > should fail when called with non registered voter
        ✔ > should fail when called with contrat owner address
    > everybody can call public storage getters
      > winningProposalID
        ✔ > should succeed when called with non registered voter
        ✔ > should succeed when called with registered voter
        ✔ > should succeed when called with contrat owner address
      > workflowStatus
        ✔ > should succeed when called with non registered voter
        ✔ > should succeed when called with registered voter
        ✔ > should succeed when called with contrat owner address
    > Voting actions are conditionned by voting session status
      ## voting status is RegisteringVoters
        > winningProposalID
          ✔ > should succeed when called with registered voter
        > getVoter
          ✔ > should succeed when called with registered voter address
        > addVoter
          ✔ > should succeed when called with contrat owner address
          ✔ > should fail when voter address is already registered
        > startProposalsRegistering
          ✔ > should succeed when called with contrat owner address
        > endProposalsRegistering
          ✔ > should fail when called with contrat owner address
        > startVotingSession
          ✔ > should fail when called with contrat owner address
        > endVotingSession
          ✔ > should fail when called with contrat owner address
        > addProposal
          ✔ > should fail when called with registered voter address
        > setVote
          ✔ > should fail when called with registered voter address
        > tallyVotes
          ✔ > should fail when called with contrat owner address
        ## voting status is ProposalsRegistrationStarted and we already have one proposal
          > winningProposalID
            ✔ > should succeed when called with registered voter
          > getVoter
            ✔ > should succeed when called with registered voter address
          > addVoter
            ✔ > should fail as session status is not RegisteringVoters
          > startProposalsRegistering
            ✔ > should fail when called with contrat owner address
          > endProposalsRegistering
            ✔ > should succeed when called with contrat owner address
          > startVotingSession
            ✔ > should fail when called with contrat owner address
          > endVotingSession
            ✔ > should fail when called with contrat owner address
          > addProposal
            ✔ > should succeed when called with registered voter address
          > setVote
            ✔ > should fail when called with registered voter address
          > tallyVotes
            ✔ > should fail when called with contrat owner address
          ## voting status is ProposalsRegistrationStopped
            > winningProposalID
              ✔ > should succeed when called with registered voter
            > getVoter
              ✔ > should succeed when called with registered voter address
            > addVoter
              ✔ > should fail as session status is not RegisteringVoters
            > startProposalsRegistering
              ✔ > should fail when called with contrat owner address
            > endProposalsRegistering
              ✔ > should fail when called with contrat owner address
            > startVotingSession
              ✔ > should succeed when called with contrat owner address
            > endVotingSession
              ✔ > should fail when called with contrat owner address
            > addProposal
              ✔ > should fail when called with registered voter address
            > setVote
              ✔ > should fail when called with registered voter address
            > tallyVotes
              ✔ > should fail when called with contrat owner address
            ## voting status is VotingSessionStarted
              > winningProposalID
                ✔ > should succeed when called with registered voter
              > getVoter
                ✔ > should succeed when called with registered voter address
              > addVoter
                ✔ > should fail as session status is not RegisteringVoters
              > startProposalsRegistering
                ✔ > should fail when called with contrat owner address
              > endProposalsRegistering
                ✔ > should fail when called with contrat owner address
              > startVotingSession
                ✔ > should fail when called with contrat owner address
              > endVotingSession
                ✔ > should succeed when called with contrat owner address
              > addProposal
                ✔ > should fail when called with registered voter address
              > setVote
                ✔ > should succeed when called with registered voter address
                ✔ > should fail when called with registered voter address that has already voted
                ✔ > should fail when called with registered voter address who votes for a non registered proposal (49ms)
              > tallyVotes
                ✔ > should fail when called with contrat owner address
              ## voting status is VotingSessionEnded
                > winningProposalID
                  ✔ > should succeed when called with registered voter
                > getVoter
                  ✔ > should succeed when called with registered voter address
                > addVoter
                  ✔ > should fail as session status is not RegisteringVoters
                > startProposalsRegistering
                  ✔ > should fail when called with contrat owner address
                > endProposalsRegistering
                  ✔ > should fail when called with contrat owner address
                > startVotingSession
                  ✔ > should fail when called with contrat owner address
                > endVotingSession
                  ✔ > should fail when called with contrat owner address (44ms)
                > addProposal
                  ✔ > should fail when called with registered voter address
                > setVote
                  ✔ > should fail when called with registered voter address
                > tallyVotes
                  ✔ > should succeed when called with contrat owner address
                ## voting status is VotesTallied
                  > winningProposalID
                    ✔ > should succeed when called with registered voter
                  > getVoter
                    ✔ > should succeed when called with registered voter address
                  > addVoter
                    ✔ > should fail as session status is not RegisteringVoters
                  > startProposalsRegistering
                    ✔ > should fail when called with contrat owner address (66ms)
                  > endProposalsRegistering
                    ✔ > should fail when called with contrat owner address
                  > startVotingSession
                    ✔ > should fail when called with contrat owner address
                  > endVotingSession
                    ✔ > should fail when called with contrat owner address
                  > addProposal
                    ✔ > should fail when called with registered voter address
                  > setVote
                    ✔ > should fail when called with registered voter address
                  > tallyVotes
                    ✔ > should fail when called with contrat owner address
    > A complete super heroes voting session
      ✔ > should allow to get a voter and his chosen proposal ID
      ✔ > should allow to get a proposal with corresponding description and votes count
      ✔ > should allow to get the voting session result
      ✔ > should allow to get all registered voter addresses with events
      ✔ > should allow to get all registered proposal ids with events
      ✔ > should allow to get all voters addresses that have voted with events
      ✔ > should allow to retrieve winning proposal ID


  197 passing (17s)
```

## Output gas reporter

```sh
·----------------------------------------------|---------------------------|-------------|-----------------------------·
|             Solc version: 0.8.17             ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 30000000 gas  │
···············································|···························|·············|······························
|  Methods                                                                                                             │
················|······························|·············|·············|·············|···············|··············
|  Contract     ·  Method                      ·  Min        ·  Max        ·  Avg        ·  # calls      ·  eur (avg)  │
················|······························|·············|·············|·············|···············|··············
|  Voting       ·  createVotingSession         ·      55672  ·      73702  ·      72236  ·           87  ·          -  │
················|······························|·············|·············|·············|···············|··············
|  Voting       ·  registerProposal            ·      88833  ·     157308  ·      95453  ·           73  ·          -  │
················|······························|·············|·············|·············|···············|··············
|  Voting       ·  registerVoter               ·      58330  ·      75454  ·      73077  ·           94  ·          -  │
················|······························|·············|·············|·············|···············|··············
|  Voting       ·  startProposalsRegistration  ·     180212  ·     180224  ·     180212  ·           65  ·          -  │
················|······························|·············|·············|·············|···············|··············
|  Voting       ·  startVotingSession          ·      33255  ·      33267  ·      33255  ·           40  ·          -  │
················|······························|·············|·············|·············|···············|··············
|  Voting       ·  stopProposalsRegistration   ·      33299  ·      33311  ·      33299  ·           51  ·          -  │
················|······························|·············|·············|·············|···············|··············
|  Voting       ·  stopVotingSession           ·      33256  ·      33268  ·      33256  ·           26  ·          -  │
················|······························|·············|·············|·············|···············|··············
|  Voting       ·  tallyVotes                  ·      51772  ·     334350  ·      91936  ·           15  ·          -  │
················|······························|·············|·············|·············|···············|··············
|  Voting       ·  vote                        ·      49819  ·      84031  ·      66921  ·           15  ·          -  │
················|······························|·············|·············|·············|···············|··············
|  VotingAlyra  ·  addProposal                 ·      58287  ·     103090  ·      62140  ·           58  ·          -  │
················|······························|·············|·············|·············|···············|··············
|  VotingAlyra  ·  addVoter                    ·      49607  ·      49619  ·      49619  ·           97  ·          -  │
················|······························|·············|·············|·············|···············|··············
|  VotingAlyra  ·  endProposalsRegistering     ·          -  ·          -  ·      30155  ·           44  ·          -  │
················|······························|·············|·············|·············|···············|··············
|  VotingAlyra  ·  endVotingSession            ·          -  ·          -  ·      30098  ·           22  ·          -  │
················|······························|·············|·············|·············|···············|··············
|  VotingAlyra  ·  setVote                     ·      59964  ·      77064  ·      74927  ·            8  ·          -  │
················|······························|·············|·············|·············|···············|··············
|  VotingAlyra  ·  startProposalsRegistering   ·          -  ·          -  ·      94254  ·           54  ·          -  │
················|······························|·············|·············|·············|···············|··············
|  VotingAlyra  ·  startVotingSession          ·          -  ·          -  ·      30113  ·           34  ·          -  │
················|······························|·············|·············|·············|···············|··············
|  VotingAlyra  ·  tallyVotes                  ·      40151  ·      71391  ·      42754  ·           12  ·          -  │
················|······························|·············|·············|·············|···············|··············
|  Deployments                                 ·                                         ·  % of limit   ·             │
···············································|·············|·············|·············|···············|··············
|  Voting                                      ·          -  ·          -  ·    2144447  ·        7.1 %  ·          -  │
···············································|·············|·············|·············|···············|··············
|  VotingAlyra                                 ·          -  ·          -  ·    1095394  ·        3.7 %  ·          -  │
·----------------------------------------------|-------------|-------------|-------------|---------------|-------------·
```