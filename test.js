const Voting = artifacts.require("./Voting.sol");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const constants = require('@openzeppelin/test-helpers/src/constants');

contract("Voting", accounts => {
  const owner = accounts[0];
  const voter1 = accounts[1];
  const voter2 = accounts[2];
  const voter3 = accounts[3];
  const voter4 = accounts[4];
  const voter5 = accounts[5];
  const voter6 = accounts[6];

  let votingInstance;

  //Registration tests 

  describe("test of voter registration", () => {
  beforeEach (async () => {
    votingInstance = await Voting.new({ from: owner });                       
});

it ("should add and register first voter", async () => {
  const receive = await votingInstance.addVoter(voter1, { from: owner });
  expectEvent(receive, "VoterRegistered" ,{voterAddress: voter1})
});

it("should revert if voter already added", async () => {
  await expectRevert(votingInstance.addVoter(voter1, {from:owner}), 'Already registered');
});

it("should add and register second voter", async () => {
  const receive = await votingInstance.addVoter(voter2, { from: owner });
  expectEvent(receive, "VoterRegistered" ,{voterAddress: voter2})
});

it("should add and check if third voter registered", async () => {
  const receive = await votingInstance.addVoter(voter3, { from: owner });
  const voter = await votingInstance.getVoter(voter3, { from: voter3 });

  assert.isTrue(voter.isRegistered, "voter3 already registred");
  expect(voter.isRegistered).to.be.true;
});

it("should revert voter registration when not allowed' => Revert", async () => {
  await expectRevert(votingInstance.addVoter(voter4, { from: owner }), "Voters registration is closed");
});
});

//Proposals tests 

describe("test of voters proposals", function () {

  beforeEach(async function () {
      votingInstance = await Voting.new({from:owner});
      await votingInstance.addVoter(voter1, { from: owner });
      await votingInstance.addVoter(voter2, { from: owner });
      await votingInstance.addVoter(voter3, { from: owner });
      await votingInstance.addVoter(voter4, { from: owner });
      await votingInstance.addVoter(voter5, { from: owner });
      await votingInstance.startProposalsRegistering({ from: owner });
  });

  it("should start registering proposal", async () => {
    const receive = await votingInstance.startProposalsRegistering({ from: owner });
    expectEvent(receive, "WorkflowStatusChange" ,{previousStatus: BN(0), newStatus: BN(1)});
  });

  it("should add first proposition of voter 1 and check the event proposalRegistered", async () => {
    const receive = await votingInstance.addProposal("First proposition", { from: voter1 });
    expectEvent(receive, "ProposalRegistered" ,{proposalId: BN(1)})
});


it("should add second proposition of voter 2 and check the event proposalRegistered", async () => {
    const receive = await votingInstance.addProposal("Second proposition", { from: voter2 });
    expectEvent(receive, "ProposalRegistered" ,{proposalId: BN(2)})
});

it("should add third proposition of voter 3 and check the event proposalRegistered", async () => {
  const receive = await votingInstance.addProposal("Third proposition", { from: voter3 });
  expectEvent(receive, "ProposalRegistered" ,{proposalId: BN(3)})
});

it("should add fourth proposition of voter 4 and check the event proposalRegistered", async () => {
  const receive = await votingInstance.addProposal("Fourth proposition", { from: voter4 });
  expectEvent(receive, "ProposalRegistered" ,{proposalId: BN(4)})
});

it("should add fifth proposition of voter 5 and check the event proposalRegistered", async () => {
  const receive = await votingInstance.addProposal("Fifth proposition", { from: voter5 });
  expectEvent(receive, "ProposalRegistered" ,{proposalId: BN(5)})
});


it("should add an empty proposal and revert", async () => {
    await expectRevert(votingInstance.addProposal("", { from: voter2 }), "Proposal empty");
});

it("should check if the voter is registered", async () => {
  await expectRevert(votingInstance.addProposal("The proposition", { from: voter6 }), "You're not a voter");
});

it("should end the proposal registration", async () => {
    const receive = await votingInstance.endProposalsRegistering({ from: owner });
    expectEvent(receive, "WorkflowStatusChange" ,{previousStatus: BN(1), newStatus: BN(2)});
});

it("should revert voter registration when not allowed", async () => {
    await expectRevert(votingInstance.addProposal("The proposition", { from: voter3 }), "Proposals registration is closed");
});
});

//Voting tests

describe("test of votes", function () {

  before(async function () {
      votingInstance = await Voting.new({from:owner});

      await votingInstance.addVoter(voter1, { from: owner });
      await votingInstance.addVoter(voter2, { from: owner });
      await votingInstance.addVoter(voter3, { from: owner });
      await votingInstance.addVoter(voter4, { from: owner });
      await votingInstance.addVoter(voter5, { from: owner });
     
      await votingInstance.startProposalsRegistering({ from: owner });

      await votingInstance.addProposal("Proposition no 1", { from: voter1 });
      await votingInstance.addProposal("Proposition no 2", { from: voter2 });
      await votingInstance.addProposal("Proposition no 3", { from: voter3 });
      await votingInstance.addProposal("Proposition no 4", { from: voter4 });
      await votingInstance.addProposal("Proposition no 4", { from: voter5 });

      await votingInstance.endProposalsRegistering({ from: owner });

      it("should revert if proposals registration not opened", async () => {
          await expectRevert(votingInstance.addProposal("Second proposition", { from: voter2 }), "Proposals are closed");
      });

      it("should start voting", async () => {
          const receive = await votingInstance.startVotingSession({ from: owner });
          expectEvent(receive, "WorkflowStatusChange" ,{previousStatus: BN(2), newStatus: BN(3)});
      });

      it("should vote for first proposal by voter 1 and verify Voted event", async () => {
          const receive = await votingInstance.setVote(0, { from: voter1 });
          expectEvent(receive, "Voted" ,{voter: voter1, proposalId: BN(0)})
      });

      it("should vote for first proposal by voter 1 and verify Voted event", async () => {
        const receive = await votingInstance.setVote(0, { from: voter1 });
        expectEvent(receive, "Voted" ,{voter: voter1, proposalId: BN(0)})
    });
    
    it("should vote for second proposal by voter 2 and verify Voted event", async () => {
      const receive = await votingInstance.setVote(0, { from: voter2 });
      expectEvent(receive, "Voted" ,{voter: voter2, proposalId: BN(0)})
  });
  
    it("should vote for third proposal by voter 3 and verify Voted event", async () => {
    const receive = await votingInstance.setVote(0, { from: voter3 });
    expectEvent(receive, "Voted" ,{voter: voter3, proposalId: BN(0)})
  });

   it("should vote for fourth proposal by voter 4 and verify Voted event", async () => {
   const receive = await votingInstance.setVote(0, { from: voter4 });
   expectEvent(receive, "Voted" ,{voter: voter4, proposalId: BN(0)})
});

it("should vote for fifth proposal by voter 5 and verify Voted event", async () => {
  const receive = await votingInstance.setVote(0, { from: voter5 });
  expectEvent(receive, "Voted" ,{voter: voter5, proposalId: BN(0)})
});

it("should end voting session", async () => {
  const receive = await votingInstance.endVotingSession({ from: owner });
  expectEvent(receive, "WorkflowStatusChange" ,{previousStatus: BN(3), newStatus: BN(4)});
});

it("should revert if voting registration not opened", async () => {
  await expectRevert(votingInstance.setVote(1, { from: voter1 }), "Voting session needs to be opened");
});
});

//Vote counting tests

describe("test of vote counting", function () {
        
  it("should display the votecount for proposition 1", async () => {
      const storedData = await votingInstance.getOneProposal(0, { from: voter1 });
      expect(storedData.voteCount).to.be.bignumber.equal(new BN(1));    
  });

  it("should display the votecount for proposition 2", async () => {
      const storedData = await votingInstance.getOneProposal(1, { from: voter2 });
      expect(storedData.voteCount).to.be.bignumber.equal(new BN(2));    
  });

  it("should display the votecount for proposition 3", async () => {
      const storedData = await votingInstance.getOneProposal(2, { from: voter3 });
      expect(storedData.voteCount).to.be.bignumber.equal(new BN(3));    
  });
  
  it("should display the votecount for proposition 4", async () => {
      const storedData = await votingInstance.getOneProposal(3, { from: voter4 });
      expect(storedData.voteCount).to.be.bignumber.equal(new BN(4));    
  });

  it("should display the votecount for proposition 5", async () => {
    const storedData = await votingInstance.getOneProposal(5, { from: voter5 });
    expect(storedData.voteCount).to.be.bignumber.equal(new BN(5));    
});
});

//Winning proposal test

describe("test of winner", function () {

  it("it should start to count votes", async () => {
      const receipt = await votingInstance.tallyVotes({ from: owner });
      expectEvent(receipt, "WorkflowStatusChange" ,{previousStatus: BN(4), newStatus: BN(5)});
  });

  it("should display the winner that is the fifth proposition ", async () => {
      expect(await votingInstance.winningProposalID.call()).to.be.bignumber.equal(new BN(1));
  });
});
});
});
