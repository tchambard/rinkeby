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
- [Ganache github action](https://github.com/tchambard/rinkeby/tree/master/.github/actions/truffle-ganache-action)
- [Un exemple de pipeline complet](https://github.com/tchambard/rinkeby/actions/runs/3292590076/jobs/5428127586)

## Typescript
Utilisation de [typechain](https://github.com/dethcrypto/TypeChain)

## Lint

Utilisation de [solhint](https://github.com/protofire/solhint)

## Eth-gas-reporter

Pour voir le gas consommé il faut décommenter eth-gas-reporter dans la section `mocha` pour l'activer avant de lancer les tests.
Je n'ai pas trouvé l'astuce permettant de calculer le gas à la demande via la commande de lancement des tests.

## Coverage

J'ai essayer de faire fonctionner [solidity-coverage](https://github.com/sc-forks/solidity-coverage) mais je n'y suis pas parvenu.
Les dernières versions ne semblent plus que fonctionner avec hardhat.

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

```

## Output des tests

```sh
Using network 'development'.


Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.

  Contract: Voting
    > Some access controls prevent functions to be called by non owners
      > createVotingSession
        ✓ > should fail when called with registered voter address
        ✓ > should fail when called with non registered voter address
      > registerVoter
        ✓ > should fail when called with registered voter address
        ✓ > should fail when called with non registered voter address
      > startProposalsRegistration
        ✓ > should fail when called with registered voter address
        ✓ > should fail when called with non registered voter address
      > stopProposalsRegistration
        ✓ > should fail when called with registered voter address
        ✓ > should fail when called with non registered voter address
      > startVotingSession
        ✓ > should fail when called with registered voter address
        ✓ > should fail when called with non registered voter address
      > stopVotingSession
        ✓ > should fail when called with registered voter address
        ✓ > should fail when called with non registered voter address
      > tallyVotes
        ✓ > should fail when called with registered voter address
        ✓ > should fail when called with non registered voter address
      > getVote
        ✓ > should fail when called with non registered voter or owner address
    > Voting actions are conditionned by voting session status
      ## voting status is RegisteringVoters
        > createVotingSession
          ✓ > should succeed when called with contract owner address (56302 gas)
        > getVote
          ✓ > should fail when called with registered voter address
          ✓ > should fail when called with contrat owner address
        > registerVoter
          ✓ > should succeed when called with contrat owner address (62077 gas)
          ✓ > should fail when voter address is already registered
          ✓ > should fail when voter address is owner contract address
        > startProposalsRegistration
          ✓ > should succeed when called with contrat owner address (184248 gas)
        > stopProposalsRegistration
          ✓ > should fail when called with contrat owner address
        > startVotingSession
          ✓ > should fail when called with contrat owner address
        > stopVotingSession
          ✓ > should fail when called with contrat owner address
        > registerProposal
          ✓ > should fail when called with non registered voter address
          ✓ > should fail when called with registered voter address
          ✓ > should fail when called with contrat owner address
        > vote
          ✓ > should fail when called with registered voter address
          ✓ > should fail when called with non registered voter address
          ✓ > should fail when called with contrat owner address
        > tallyVotes
          ✓ > should fail when called with contrat owner address
        ## voting status is ProposalsRegistrationStarted
          > createVotingSession
            ✓ > should succeed when called with contract owner address (56302 gas)
          > getVote
            ✓ > should fail when called with registered voter address
            ✓ > should fail when called with contrat owner address
          > registerVoter
            ✓ > should fail as session status is not RegisteringVoters
          > startProposalsRegistration
            ✓ > should fail when called with contrat owner address
          > stopProposalsRegistration
            ✓ > should succeed when called with contrat owner address (35896 gas)
          > startVotingSession
            ✓ > should fail when called with contrat owner address
          > stopVotingSession
            ✓ > should fail when called with contrat owner address
          > registerProposal
            ✓ > should fail when called with non registered voter address
            ✓ > should succeed when called with registered voter address (137484 gas)
            ✓ > should fail when called more times than maximum allowed (229450 gas)
            ✓ > should fail when called with contrat owner address
          > vote
            ✓ > should fail when called with registered voter address
          > tallyVotes
            ✓ > should fail when called with contrat owner address
          ## voting status is ProposalsRegistrationStopped
            > createVotingSession
              ✓ > should succeed when called with contract owner address (56302 gas)
            > getVote
              ✓ > should fail when called with registered voter address
              ✓ > should fail when called with contrat owner address
            > registerVoter
              ✓ > should fail as session status is not RegisteringVoters
            > startProposalsRegistration
              ✓ > should fail when called with contrat owner address
            > stopProposalsRegistration
              ✓ > should fail when called with contrat owner address
            > startVotingSession
              ✓ > should succeed when called with contrat owner address (35852 gas)
            > stopVotingSession
              ✓ > should fail when called with contrat owner address
            > registerProposal
              ✓ > should fail when called with registered voter address
            > vote
              ✓ > should fail when called with registered voter address
            > tallyVotes
              ✓ > should fail when called with contrat owner address
            ## voting status is VotingSessionStarted
              > createVotingSession
                ✓ > should succeed when called with contract owner address (56302 gas)
              > getVote
                ✓ > should fail when called with registered voter address
                ✓ > should fail when called with contrat owner address
              > registerVoter
                ✓ > should fail as session status is not RegisteringVoters
              > startProposalsRegistration
                ✓ > should fail when called with contrat owner address
              > stopProposalsRegistration
                ✓ > should fail when called with contrat owner address
              > startVotingSession
                ✓ > should fail when called with contrat owner address
              > stopVotingSession
                ✓ > should succeed when called with contrat owner address (35853 gas)
              > registerProposal
                ✓ > should fail when called with registered voter address
              > vote
                ✓ > should succeed when called with registered voter address (88464 gas)
                ✓ > should fail when called with registered voter address that has already voted (88464 gas)
                ✓ > should fail when called with registered voter address who votes for its own proposal
                ✓ > should fail when called with registered voter address who votes for abstention proposal
              > tallyVotes
                ✓ > should fail when called with contrat owner address
              ## voting status is VotingSessionEnded
                > createVotingSession
                  ✓ > should succeed when called with contract owner address (56302 gas)
                > getVote
                  ✓ > should succeed when called with registered voter address
                  ✓ > should succeed when called with contrat owner address
                > registerVoter
                  ✓ > should fail as session status is not RegisteringVoters
                > startProposalsRegistration
                  ✓ > should fail when called with contrat owner address
                > stopProposalsRegistration
                  ✓ > should fail when called with contrat owner address
                > startVotingSession
                  ✓ > should fail when called with contrat owner address
                > stopVotingSession
                  ✓ > should fail when called with contrat owner address
                > registerProposal
                  ✓ > should fail when called with registered voter address
                > vote
                  ✓ > should fail when called with registered voter address
                > tallyVotes
                  ✓ > should succeed when called with contrat owner address (55375 gas)
                ## voting status is VotesTallied
                  > createVotingSession
                    ✓ > should succeed when called with contract owner address (56302 gas)
                  > getVote
                    ✓ > should succeed when called with registered voter address
                    ✓ > should succeed when called with contrat owner address
                  > registerVoter
                    ✓ > should fail as session status is not RegisteringVoters
                  > startProposalsRegistration
                    ✓ > should fail when called with contrat owner address
                  > stopProposalsRegistration
                    ✓ > should fail when called with contrat owner address
                  > startVotingSession
                    ✓ > should fail when called with contrat owner address
                  > stopVotingSession
                    ✓ > should fail when called with contrat owner address
                  > registerProposal
                    ✓ > should fail when called with registered voter address
                  > vote
                    ✓ > should fail when called with registered voter address
                  > tallyVotes
                    ✓ > should fail when called with contrat owner address
    > A complete super heroes voting session
      ✓ > should allow to get all registered voter addresses with events
      ✓ > should allow to get all registered proposal ids with events
      ✓ > should allow to get all voters addresses that have voted with events
      ✓ > should allow to get the voting session result with events
    > Many parallel voting sessions
      ✓ > should allow to get all registered voter addresses with events filtering on sessionId
      ✓ > should allow to get all registered proposal ids with events filtering on sessionId
      ✓ > should allow to get all voters addresses that have voted with events filtering on sessionId
      ✓ > should allow to get the voting session result with events filtering on sessionId

  Contract: VotingAlyra
    > onlyOwner modifer prevents functions to be called by non owners
      > addVoter
        ✓ > should fail when called with registered voter address
        ✓ > should fail when called with non registered voter address
      > startProposalsRegistering
        ✓ > should fail when called with registered voter address
        ✓ > should fail when called with non registered voter address
      > endProposalsRegistering
        ✓ > should fail when called with registered voter address
        ✓ > should fail when called with non registered voter address
      > startVotingSession
        ✓ > should fail when called with registered voter address
        ✓ > should fail when called with non registered voter address
      > endVotingSession
        ✓ > should fail when called with registered voter address
        ✓ > should fail when called with non registered voter address
      > tallyVotes
        ✓ > should fail when called with registered voter address
        ✓ > should fail when called with non registered voter address
    > onlyVoters modifier prevents functions to be called by non voters
      > getVoter
        ✓ > should fail when called with non registered voter
        ✓ > should fail when called with contrat owner address
      > getOneProposal
        ✓ > should fail when called with non registered voter
        ✓ > should fail when called with contrat owner address
      > addProposal
        ✓ > should fail when called with non registered voter
        ✓ > should fail when called with contrat owner address
      > setVote
        ✓ > should fail when called with non registered voter
        ✓ > should fail when called with contrat owner address
    > everybody can call public storage getters
      > winningProposalID
        ✓ > should succeed when called with non registered voter
        ✓ > should succeed when called with registered voter
        ✓ > should succeed when called with contrat owner address
      > workflowStatus
        ✓ > should succeed when called with non registered voter
        ✓ > should succeed when called with registered voter
        ✓ > should succeed when called with contrat owner address
    > Voting actions are conditionned by voting session status
      ## voting status is RegisteringVoters
        > getVoter
          ✓ > should succeed when called with registered voter address
        > addVoter
          ✓ > should succeed when called with contrat owner address (50220 gas)
          ✓ > should fail when voter address is already registered
        > startProposalsRegistering
          ✓ > should succeed when called with contrat owner address (95032 gas)
        > endProposalsRegistering
          ✓ > should fail when called with contrat owner address
        > startVotingSession
          ✓ > should fail when called with contrat owner address
        > endVotingSession
          ✓ > should fail when called with contrat owner address
        > addProposal
          ✓ > should fail when called with registered voter address
        > setVote
          ✓ > should fail when called with registered voter address
        > tallyVotes
          ✓ > should fail when called with contrat owner address
        ## voting status is ProposalsRegistrationStarted and we already have one proposal
          > getVoter
            ✓ > should succeed when called with registered voter address
          > addVoter
            ✓ > should fail as session status is not RegisteringVoters
          > startProposalsRegistering
            ✓ > should fail when called with contrat owner address
          > endProposalsRegistering
            ✓ > should succeed when called with contrat owner address (30599 gas)
          > startVotingSession
            ✓ > should fail when called with contrat owner address
          > endVotingSession
            ✓ > should fail when called with contrat owner address
          > addProposal
            ✓ > should succeed when called with registered voter address (104210 gas)
          > setVote
            ✓ > should fail when called with registered voter address
          > tallyVotes
            ✓ > should fail when called with contrat owner address
          ## voting status is ProposalsRegistrationStopped
            > getVoter
              ✓ > should succeed when called with registered voter address
            > addVoter
              ✓ > should fail as session status is not RegisteringVoters
            > startProposalsRegistering
              ✓ > should fail when called with contrat owner address
            > endProposalsRegistering
              ✓ > should fail when called with contrat owner address
            > startVotingSession
              ✓ > should succeed when called with contrat owner address (30554 gas)
            > endVotingSession
              ✓ > should fail when called with contrat owner address
            > addProposal
              ✓ > should fail when called with registered voter address
            > setVote
              ✓ > should fail when called with registered voter address
            > tallyVotes
              ✓ > should fail when called with contrat owner address
            ## voting status is VotingSessionStarted
              > getVoter
                ✓ > should succeed when called with registered voter address
              > addVoter
                ✓ > should fail as session status is not RegisteringVoters
              > startProposalsRegistering
                ✓ > should fail when called with contrat owner address
              > endProposalsRegistering
                ✓ > should fail when called with contrat owner address
              > startVotingSession
                ✓ > should fail when called with contrat owner address
              > endVotingSession
                ✓ > should succeed when called with contrat owner address (30533 gas)
              > addProposal
                ✓ > should fail when called with registered voter address
              > setVote
                ✓ > should succeed when called with registered voter address (78013 gas)
                ✓ > should fail when called with registered voter address that has already voted (78013 gas)
                ✓ > should fail when called with registered voter address who votes for a non registered proposal
              > tallyVotes
                ✓ > should fail when called with contrat owner address
              ## voting status is VotingSessionEnded
                > getVoter
                  ✓ > should succeed when called with registered voter address
                > addVoter
                  ✓ > should fail as session status is not RegisteringVoters
                > startProposalsRegistering
                  ✓ > should fail when called with contrat owner address
                > endProposalsRegistering
                  ✓ > should fail when called with contrat owner address
                > startVotingSession
                  ✓ > should fail when called with contrat owner address
                > endVotingSession
                  ✓ > should fail when called with contrat owner address
                > addProposal
                  ✓ > should fail when called with registered voter address
                > setVote
                  ✓ > should fail when called with registered voter address
                > tallyVotes
                  ✓ > should succeed when called with contrat owner address (40753 gas)
                ## voting status is VotesTallied
                  > getVoter
                    ✓ > should succeed when called with registered voter address
                  > addVoter
                    ✓ > should fail as session status is not RegisteringVoters
                  > startProposalsRegistering
                    ✓ > should fail when called with contrat owner address
                  > endProposalsRegistering
                    ✓ > should fail when called with contrat owner address
                  > startVotingSession
                    ✓ > should fail when called with contrat owner address
                  > endVotingSession
                    ✓ > should fail when called with contrat owner address
                  > addProposal
                    ✓ > should fail when called with registered voter address
                  > setVote
                    ✓ > should fail when called with registered voter address
                  > tallyVotes
                    ✓ > should fail when called with contrat owner address
    > A complete super heroes voting session
      ✓ > should allow to get a voter and his chosen proposal ID
      ✓ > should allow to get a proposal with corresponding description and votes count
      ✓ > should allow to get the voting session result
      ✓ > should allow to get all registered voter addresses with events
      ✓ > should allow to get all registered proposal ids with events
      ✓ > should allow to get all voters addresses that have voted with events

·----------------------------------------------|----------------------------|-------------|----------------------------·
|     Solc version: 0.8.17+commit.8df45f5f     ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 6718946 gas  │
···············································|····························|·············|·····························
|  Methods                                                                                                             │
················|······························|·············|··············|·············|··············|··············
|  Contract     ·  Method                      ·  Min        ·  Max         ·  Avg        ·  # calls     ·  eur (avg)  │
················|······························|·············|··············|·············|··············|··············
|  Voting       ·  createVotingSession         ·      56302  ·       74236  ·      71845  ·          90  ·          -  │
················|······························|·············|··············|·············|··············|··············
|  Voting       ·  registerProposal            ·      91966  ·      137484  ·      93852  ·          76  ·          -  │
················|······························|·············|··············|·············|··············|··············
|  Voting       ·  registerVoter               ·      62077  ·       79177  ·      78813  ·          94  ·          -  │
················|······························|·············|··············|·············|··············|··············
|  Voting       ·  startProposalsRegistration  ·          -  ·           -  ·     184248  ·          63  ·          -  │
················|······························|·············|··············|·············|··············|··············
|  Voting       ·  startVotingSession          ·          -  ·           -  ·      35852  ·          48  ·          -  │
················|······························|·············|··············|·············|··············|··············
|  Voting       ·  stopProposalsRegistration   ·          -  ·           -  ·      35896  ·          58  ·          -  │
················|······························|·············|··············|·············|··············|··············
|  Voting       ·  stopVotingSession           ·          -  ·           -  ·      35853  ·          33  ·          -  │
················|······························|·············|··············|·············|··············|··············
|  Voting       ·  tallyVotes                  ·      55375  ·      340943  ·     116611  ·          30  ·          -  │
················|······························|·············|··············|·············|··············|··············
|  Voting       ·  vote                        ·          -  ·           -  ·      88464  ·           4  ·          -  │
················|······························|·············|··············|·············|··············|··············
|  VotingAlyra  ·  addProposal                 ·      59496  ·      104210  ·      61093  ·          56  ·          -  │
················|······························|·············|··············|·············|··············|··············
|  VotingAlyra  ·  addVoter                    ·          -  ·           -  ·      50220  ·         119  ·          -  │
················|······························|·············|··············|·············|··············|··············
|  VotingAlyra  ·  endProposalsRegistering     ·          -  ·           -  ·      30599  ·          48  ·          -  │
················|······························|·············|··············|·············|··············|··············
|  VotingAlyra  ·  endVotingSession            ·          -  ·           -  ·      30533  ·          28  ·          -  │
················|······························|·············|··············|·············|··············|··············
|  VotingAlyra  ·  setVote                     ·          -  ·           -  ·      78013  ·           4  ·          -  │
················|······························|·············|··············|·············|··············|··············
|  VotingAlyra  ·  startProposalsRegistering   ·          -  ·           -  ·      95032  ·          49  ·          -  │
················|······························|·············|··············|·············|··············|··············
|  VotingAlyra  ·  startVotingSession          ·          -  ·           -  ·      30554  ·          39  ·          -  │
················|······························|·············|··············|·············|··············|··············
|  VotingAlyra  ·  tallyVotes                  ·      40753  ·       72285  ·      48321  ·          25  ·          -  │
················|······························|·············|··············|·············|··············|··············
|  Deployments                                 ·                                          ·  % of limit  ·             │
···············································|·············|··············|·············|··············|··············
|  Voting                                      ·          -  ·           -  ·    3606971  ·      53.7 %  ·          -  │
···············································|·············|··············|·············|··············|··············
|  VotingAlyra                                 ·          -  ·           -  ·    2077414  ·      30.9 %  ·          -  │
·----------------------------------------------|-------------|--------------|-------------|--------------|-------------·

  190 passing (3m)

```