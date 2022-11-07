# Projet - Système de vote 3 - dApp React + web3.js

## Rappel
- [Le contrat utilsé](https://github.com/tchambard/rinkeby/blob/master/packages/rinkeby-voting-contracts/contracts/Voting.sol)
- [Le README du rendu précédant](https://github.com/tchambard/rinkeby/tree/master/packages/rinkeby-voting-contracts/test)

## Modification apportées au contrat rendu lors du projet #1

- Modification de l'event `ProposalRegistered` afin de rajouter l'address du `proposer` ainsi que la `description`.
- Modification de l'event `Voted` pour revenir sur ma décision de modifier la specification (suppression du paramètre `proposalId`) lors du rendu du projet #1 et suivre les remarques qui m'ont été faites.
- Modification de tous les messages des requires afin de diminuer l'impact sur le gas consommé.
- Suppression de la contrainte empéchant un votant de voter pour sa propre proposition afin de suivre les remarques qui m'ont été faites.
- Suppression de la contrainte limitant un voter a enregistrer plus de trois propositions (cela n'apportait pas grand chose).

## Sécurité

La faille présente dans la correction du contrat fournie par Alyra est une faille Dos Gas limit qui peut avoir lieu lors de l'execution de la fonction `tallyVotes`.

Dans ma version du contrat rendu lors du projet 1, j'avais déja comblé cette faille en limitant le nombre de proposals simplement en utilisant le type `uint8` sur la déclaration du tableau de proposals. 

J'avais également ajouté le require suivant dans la fonction `registerProposal`:

```sol
    require(sessions[_sessionId].proposals.length < 2 ** 8 - 1, 'Too many proposals'); // limit total proposals count to 256
```

Celui-ci permettait à l'appelant d'avoir un message d'erreur clair, mais avec du recul, je me dis qu'il vaut mieux l'enlever pour économiser du gas et utiliser l'erreur `VM Exception while processing transaction: reverted with panic code 0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)`.

J'ai ajouté un test unitaire permettant de vérifier qu'il n'est pas possible d'enregistrer plus de 255 proposals. Par curiosité j'ai voulu voir s'il était possible d'utiliser un `uint16` (ce qui correspondrait à un tableau de 65536 proposals). Je n'ai pas procédé à une dicotomie très fine, cependant simplement avec 10000 proposalsals enregistrées, j'obtient l'erreur `out of gas`, ce qui me conforte dans mon choix.

## dApp

Le projet React est assez conséquent, et il n'est clairement pas nécessaire de s'interresser à l'ensemble du code.
L'essentiel du code concernant le projet voting se trouve [içi](./src/content/voting/)

### Les outils utilisés

- Typescript
- React
- web3
- rxjs + redux-observable + typesafe-actions