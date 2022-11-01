# Test-Voting

Dans le cadre du projet 2 de la formation développeur Blockchain Alyra nous avons été amené à réaliser des tests sur le contract Voting.

Le test a été fait en 4 parties : Registration tests, Proposals tests, Voting tests, Vote counting tests, Winning proposal test.

• Registration tests :

Cette partie correspond aux tests sur l'enregistrment des votants, à l'aide de plusieurs it on vérifie que la fonction addVoter ajoute bien un votant et que l'évènement VoterRegistred a bien été émis après l'ajout du votant. On vérifie également que le votant n'a pas déjà été enregistré avec le expectRevert "Already registered". Enfin on vérifie si le revert s'active quand on essaie d'enregistrer un votant en dehors de la session d'enregistrement des votants.

• Proposals tests :

Cette partie correspond aux tests sur l'enregistrment des proposals, ici on vérifie que le votant puisse ajouter une proposition et que l'évènement ProposalRegistered a bien été émis après l'ajout de la proposition par le votant. On vérifie que le votant a bien rentré une proposition valide => sinon revert. On vérifie également si le revert s'active quand un votant fait une proposition en dehors de la session d'enregistrement des proposals.

• Voting tests :

Cette partie correspond aux tests sur l'enregistrment des votes, on commence par vérifier si le vote d'un votant est bien enregistré et si l'event Voted est bien émit suite à cela. On vérifie si le revert fonctionne quand on essaie de voter alors que la session de vote n'est pas ouverte. On vérifie également. On vérifie également si la session de vote commence bien quand on utilise la fonction startVotingSession et si elle se termine quand on utilise la fonction endVotingSession.

Vote counting tests :

Cette partie correspond aux tests sur le dépouillemment des votes. Ici on vérifie si le nombre de votecount est bien affiché par la fonction getOneProposal.

Winning proposal tests :

Cette partie correspond aux tests sur l'annonce du gagnant, un premier it nous permet de vérifier si le comptage des votes a bien lieu. Un deuxième it nous permet de vérifier si le gagnant est bien retourné par le call de winningProposalId.
