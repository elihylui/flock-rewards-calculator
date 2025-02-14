"use client";
import React, { useState } from "react";
import Image from "next/image";

/* ------------------------------------------------------------------
  STEP 1: Split R0 between Training Nodes & Validators
    trainingRewards = R0 * [
      gamma + (1 - 2γ) * (
        sumNodeDirect / (sumNodeDirect + sumValidatorDirect)
      )
    ]
    validatorRewards = R0 - trainingRewards
 ------------------------------------------------------------------ */
function computeTrainingRewards(
  R0: number,
  gamma: number,
  totalNodeDirect: number,
  totalValidatorDirect: number
): number {
  const denom = totalNodeDirect + totalValidatorDirect;
  if (denom === 0) return 0;

  // Fraction for nodes = sumNodeDirect / (sumNodeDirect + sumValidatorDirect)
  const fractionNodes = totalNodeDirect / denom;
  return R0 * (gamma + (1 - 2 * gamma) * fractionNodes);
}

/* ------------------------------------------------------------------
  STEP 2: Distribute among multiple participants with:
    fraction_i = [ performance_i * (stake_i)^alpha ] / Σ( ... )
 ------------------------------------------------------------------ */
function computeFractions(
  performanceArray: number[],
  stakeArray: number[],
  alpha: number
): number[] {
  let denominator = 0;
  for (let i = 0; i < performanceArray.length; i++) {
    denominator += performanceArray[i] * Math.pow(stakeArray[i], alpha);
  }
  if (denominator === 0) {
    // Return 0 if everything is 0
    return performanceArray.map(() => 0);
  }
  return performanceArray.map((p, i) => {
    const numerator = p * Math.pow(stakeArray[i], alpha);
    return numerator / denominator;
  });
}

/* ------------------------------------------------------------------
  STEP 3: Split total reward between "owner" and delegators
    ownerReward = total * [
      sigma + (1-sigma)*(ownerStake/(ownerStake+delegatorsStake))
    ]
    delegatorsReward = total - ownerReward
 ------------------------------------------------------------------ */
function splitOwnerAndDelegators(
  totalReward: number,
  ownerStake: number,
  delegatorsStake: number,
  sigma: number
): { ownerReward: number; delegatorsReward: number } {
  const totalStake = ownerStake + delegatorsStake;
  if (totalStake === 0) {
    return { ownerReward: 0, delegatorsReward: 0 };
  }
  const ownerShare =
    totalReward * (sigma + (1 - sigma) * (ownerStake / totalStake));
  const delegatorsShare = totalReward - ownerShare;
  return { ownerReward: ownerShare, delegatorsReward: delegatorsShare };
}

/* ------------------------------------------------------------------
  Types for storing partial steps
 ------------------------------------------------------------------ */
interface Step1Calc {
  nodeDirectSum: number;       // sum of direct node stakes
  validatorDirectSum: number;  // sum of direct validator stakes
  fractionNodes: number;       // nodeDirectSum / (nodeDirectSum + validatorDirectSum)
  trainingRewards: number;
  validatorRewards: number;
}

interface NodeCalcDetail {
  index: number;               // A=0, B=1, C=2
  directStake: number;         // e.g. node stake only
  delegatorsStake: number;     // from the user input
  totalStake: number;          // direct + delegators
  performance: number;         // node's score
  fraction: number;            // fraction_i from computeFractions
  totalRewardBeforeSplit: number;
  nodeOwnerReward: number;
  nodeDelegatorsReward: number;
}

interface ValCalcDetail {
  index: number;
  directStake: number;
  delegatorsStake: number;
  totalStake: number;          
  performance: number;
  fraction: number;
  totalRewardBeforeSplit: number;
  validatorOwnerReward: number;
  validatorDelegatorsReward: number;
}

export default function Home() {
  //
  // ----------------------------------------------------
  // 1) System parameters
  // ----------------------------------------------------
  const [R0, setR0] = useState<number>(309157.68);
  const [gamma, setGamma] = useState<number>(0);
  const [alphaT, setAlphaT] = useState<number>(1.0);
  const [alphaV, setAlphaV] = useState<number>(1.0);

  //
  // ----------------------------------------------------
  // 2) NODES (3)
  //   - direct stake (the node's own stake)
  //   - delegators (the stake delegated to that node)
  //   - performance score (must sum to 1 among all nodes)
  //   - sigma
  // ----------------------------------------------------
  // Node A
  const [nodeAStake, setNodeAStake] = useState<number>(3000);
  const [nodeADelegators, setNodeADelegators] = useState<number>(1000);
  const [nodeAScore, setNodeAScore] = useState<number>(0.501435);
  const [nodeASigma, setNodeASigma] = useState<number>(0.4);

  // Node B
  const [nodeBStake, setNodeBStake] = useState<number>(3500);
  const [nodeBDelegators, setNodeBDelegators] = useState<number>(0);
  const [nodeBScore, setNodeBScore] = useState<number>(0.498565);
  const [nodeBSigma, setNodeBSigma] = useState<number>(0.4);

  // Node C
  const [nodeCStake, setNodeCStake] = useState<number>(0);
  const [nodeCDelegators, setNodeCDelegators] = useState<number>(0);
  const [nodeCScore, setNodeCScore] = useState<number>(0.0);
  const [nodeCSigma, setNodeCSigma] = useState<number>(0.4);

  //
  // ----------------------------------------------------
  // 3) VALIDATORS (3)
  // ----------------------------------------------------
  // Validator A
  const [valAStake, setValAStake] = useState<number>(3000);
  const [valADelegators, setValADelegators] = useState<number>(0);
  const [valAScore, setValAScore] = useState<number>(0.472768);
  const [valASigma, setValASigma] = useState<number>(0.4);

  // Validator B
  const [valBStake, setValBStake] = useState<number>(6000);
  const [valBDelegators, setValBDelegators] = useState<number>(0);
  const [valBScore, setValBScore] = useState<number>(0.280226);
  const [valBSigma, setValBSigma] = useState<number>(0.4);

  // Validator C
  const [valCStake, setValCStake] = useState<number>(3000);
  const [valCDelegators, setValCDelegators] = useState<number>(0);
  const [valCScore, setValCScore] = useState<number>(0.247006);
  const [valCSigma, setValCSigma] = useState<number>(0.4);

  //
  // ----------------------------------------------------
  // 4) Final results
  // ----------------------------------------------------
  // Step 1 results
  const [trainingRewards, setTrainingRewards] = useState<number>(0);
  const [validatorRewards, setValidatorRewards] = useState<number>(0);

  // Node A, B, C final
  const [nodeAResult, setNodeAResult] = useState<number>(0);
  const [nodeADelegatorsResult, setNodeADelegatorsResult] = useState<number>(0);
  const [nodeBResult, setNodeBResult] = useState<number>(0);
  const [nodeBDelegatorsResult, setNodeBDelegatorsResult] = useState<number>(0);
  const [nodeCResult, setNodeCResult] = useState<number>(0);
  const [nodeCDelegatorsResult, setNodeCDelegatorsResult] = useState<number>(0);

  // Validator A, B, C final
  const [valAResult, setValAResult] = useState<number>(0);
  const [valADelegatorsResult, setValADelegatorsResult] = useState<number>(0);
  const [valBResult, setValBResult] = useState<number>(0);
  const [valBDelegatorsResult, setValBDelegatorsResult] = useState<number>(0);
  const [valCResult, setValCResult] = useState<number>(0);
  const [valCDelegatorsResult, setValCDelegatorsResult] = useState<number>(0);

  //
  // ----------------------------------------------------
  // 5) Calculation Steps for display
  // ----------------------------------------------------
  const [step1Calc, setStep1Calc] = useState<Step1Calc | null>(null);
  const [nodeCalcDetails, setNodeCalcDetails] = useState<NodeCalcDetail[]>([]);
  const [valCalcDetails, setValCalcDetails] = useState<ValCalcDetail[]>([]);

  //
  // ----------------------------------------------------
  // 6) Handle Compute
  // ----------------------------------------------------
  const handleCompute = () => {
    // Check node scores sum to 1
    const nodeScoreSum = nodeAScore + nodeBScore + nodeCScore;
    if (Math.abs(nodeScoreSum - 1) > 1e-9) {
      alert(`Node scores must sum to 1 (currently: ${nodeScoreSum.toFixed(6)})`);
      return;
    }

    // Check validator scores sum to 1
    const valScoreSum = valAScore + valBScore + valCScore;
    if (Math.abs(valScoreSum - 1) > 1e-9) {
      alert(
        `Validator scores must sum to 1 (currently: ${valScoreSum.toFixed(6)})`
      );
      return;
    }

    // -----------------------
    // Step 1: direct stakes only
    // -----------------------
    const nodeDirectStakes = [nodeAStake, nodeBStake, nodeCStake];
    const sumNodeDirect = nodeDirectStakes.reduce((a, b) => a + b, 0);

    const valDirectStakes = [valAStake, valBStake, valCStake];
    const sumValDirect = valDirectStakes.reduce((a, b) => a + b, 0);

    const tRewards = computeTrainingRewards(R0, gamma, sumNodeDirect, sumValDirect);
    const vRewards = R0 - tRewards;

    setTrainingRewards(tRewards);
    setValidatorRewards(vRewards);

    // Save partial steps
    const fractionNodes = sumNodeDirect === 0 ? 0 : sumNodeDirect / (sumNodeDirect + sumValDirect);
    setStep1Calc({
      nodeDirectSum: sumNodeDirect,
      validatorDirectSum: sumValDirect,
      fractionNodes,
      trainingRewards: tRewards,
      validatorRewards: vRewards,
    });

    // -----------------------
    // Step 2 (Nodes): total stake = direct + delegators
    // Distribute "tRewards" among 3 nodes
    // fraction_i = (g_i * totalStake_i^alphaT) / sum( all i )
    // Then Step 3: split between node & delegators
    // -----------------------
    const nodeTotalStakes = [
      nodeAStake + nodeADelegators,
      nodeBStake + nodeBDelegators,
      nodeCStake + nodeCDelegators,
    ];
    const nodeScores = [nodeAScore, nodeBScore, nodeCScore];
    const nodeFracs = computeFractions(nodeScores, nodeTotalStakes, alphaT);

    const newNodeCalcDetails: NodeCalcDetail[] = [];

    // Node A
    const nodeATotal = nodeFracs[0] * tRewards;
    const splitA = splitOwnerAndDelegators(
      nodeATotal,
      nodeAStake,
      nodeADelegators,
      nodeASigma
    );
    setNodeAResult(splitA.ownerReward);
    setNodeADelegatorsResult(splitA.delegatorsReward);

    newNodeCalcDetails.push({
      index: 0,
      directStake: nodeAStake,
      delegatorsStake: nodeADelegators,
      totalStake: nodeAStake + nodeADelegators,
      performance: nodeAScore,
      fraction: nodeFracs[0],
      totalRewardBeforeSplit: nodeATotal,
      nodeOwnerReward: splitA.ownerReward,
      nodeDelegatorsReward: splitA.delegatorsReward,
    });

    // Node B
    const nodeBTotal = nodeFracs[1] * tRewards;
    const splitB = splitOwnerAndDelegators(
      nodeBTotal,
      nodeBStake,
      nodeBDelegators,
      nodeBSigma
    );
    setNodeBResult(splitB.ownerReward);
    setNodeBDelegatorsResult(splitB.delegatorsReward);

    newNodeCalcDetails.push({
      index: 1,
      directStake: nodeBStake,
      delegatorsStake: nodeBDelegators,
      totalStake: nodeBStake + nodeBDelegators,
      performance: nodeBScore,
      fraction: nodeFracs[1],
      totalRewardBeforeSplit: nodeBTotal,
      nodeOwnerReward: splitB.ownerReward,
      nodeDelegatorsReward: splitB.delegatorsReward,
    });

    // Node C
    const nodeCTotal = nodeFracs[2] * tRewards;
    const splitC = splitOwnerAndDelegators(
      nodeCTotal,
      nodeCStake,
      nodeCDelegators,
      nodeCSigma
    );
    setNodeCResult(splitC.ownerReward);
    setNodeCDelegatorsResult(splitC.delegatorsReward);

    newNodeCalcDetails.push({
      index: 2,
      directStake: nodeCStake,
      delegatorsStake: nodeCDelegators,
      totalStake: nodeCStake + nodeCDelegators,
      performance: nodeCScore,
      fraction: nodeFracs[2],
      totalRewardBeforeSplit: nodeCTotal,
      nodeOwnerReward: splitC.ownerReward,
      nodeDelegatorsReward: splitC.delegatorsReward,
    });

    setNodeCalcDetails(newNodeCalcDetails);

    // -----------------------
    // Step 2 (Validators): total stake = direct + delegators
    // Distribute "vRewards"
    // -----------------------
    const valTotalStakes = [
      valAStake + valADelegators,
      valBStake + valBDelegators,
      valCStake + valCDelegators,
    ];
    const valScores = [valAScore, valBScore, valCScore];
    const valFracs = computeFractions(valScores, valTotalStakes, alphaV);

    const newValCalcDetails: ValCalcDetail[] = [];

    // Validator A
    const valATotal = valFracs[0] * vRewards;
    const splitValA = splitOwnerAndDelegators(
      valATotal,
      valAStake,
      valADelegators,
      valASigma
    );
    setValAResult(splitValA.ownerReward);
    setValADelegatorsResult(splitValA.delegatorsReward);

    newValCalcDetails.push({
      index: 0,
      directStake: valAStake,
      delegatorsStake: valADelegators,
      totalStake: valAStake + valADelegators,
      performance: valAScore,
      fraction: valFracs[0],
      totalRewardBeforeSplit: valATotal,
      validatorOwnerReward: splitValA.ownerReward,
      validatorDelegatorsReward: splitValA.delegatorsReward,
    });

    // Validator B
    const valBTotal = valFracs[1] * vRewards;
    const splitValB = splitOwnerAndDelegators(
      valBTotal,
      valBStake,
      valBDelegators,
      valBSigma
    );
    setValBResult(splitValB.ownerReward);
    setValBDelegatorsResult(splitValB.delegatorsReward);

    newValCalcDetails.push({
      index: 1,
      directStake: valBStake,
      delegatorsStake: valBDelegators,
      totalStake: valBStake + valBDelegators,
      performance: valBScore,
      fraction: valFracs[1],
      totalRewardBeforeSplit: valBTotal,
      validatorOwnerReward: splitValB.ownerReward,
      validatorDelegatorsReward: splitValB.delegatorsReward,
    });

    // Validator C
    const valCTotal = valFracs[2] * vRewards;
    const splitValC = splitOwnerAndDelegators(
      valCTotal,
      valCStake,
      valCDelegators,
      valCSigma
    );
    setValCResult(splitValC.ownerReward);
    setValCDelegatorsResult(splitValC.delegatorsReward);

    newValCalcDetails.push({
      index: 2,
      directStake: valCStake,
      delegatorsStake: valCDelegators,
      totalStake: valCStake + valCDelegators,
      performance: valCScore,
      fraction: valFracs[2],
      totalRewardBeforeSplit: valCTotal,
      validatorOwnerReward: splitValC.ownerReward,
      validatorDelegatorsReward: splitValC.delegatorsReward,
    });

    setValCalcDetails(newValCalcDetails);
  };

  // Summaries for Node & Validator Scores
  const nodeScoreSum = nodeAScore + nodeBScore + nodeCScore;
  const valScoreSum = valAScore + valBScore + valCScore;

  return (
    <div className="min-h-screen p-6 sm:p-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: 2/3 width */}
        <div className="w-full lg:w-2/3 border border-gray-200 rounded p-4">
          <div className="flex items-center gap-4 mb-4">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={100}
              height={24}
              priority
            />
            <h1 className="text-lg font-bold">AI Arena Rewards Calculator</h1>
          </div>

          {/* System Params */}
          <h2 className="font-semibold mb-2">System Parameters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <label className="block">
              Daily Reward (R0)
              <input
                type="number"
                className="appearance-none border px-2 py-1 w-full rounded mt-1"
                value={R0}
                onChange={(e) => setR0(parseFloat(e.target.value) || 0)}
              />
            </label>
            <label className="block">
              γ (Reward Split Ratio beween Training Nodes & Validators) 
              <input
                type="number"
                step="0.01"
                className="appearance-none border px-2 py-1 w-full rounded mt-1"
                value={gamma}
                onChange={(e) => setGamma(parseFloat(e.target.value) || 0)}
              />
            </label>
            <label className="block">
              α<sub>t</sub> (Stake's Influence on Rewards for Training Nodes)
              <input
                type="number"
                step="0.1"
                className="appearance-none border px-2 py-1 w-full rounded mt-1"
                value={alphaT}
                onChange={(e) => setAlphaT(parseFloat(e.target.value) || 0)}
              />
            </label>
            <label className="block">
              α<sub>V</sub> (Stake's Influence on Rewards for Validators)
              <input
                type="number"
                step="0.1"
                className="appearance-none border px-2 py-1 w-full rounded mt-1"
                value={alphaV}
                onChange={(e) => setAlphaV(parseFloat(e.target.value) || 0)}
              />
            </label>
          </div>

          {/* NODES */}
          <h2 className="font-semibold mb-2">Training Nodes</h2>
          <p className="text-sm text-gray-600 mb-2">
            Node Score Sum:{" "}
            <span
              className={
                Math.abs(nodeScoreSum - 1) < 1e-9 ? "text-green-600" : "text-red-600"
              }
            >
              {nodeScoreSum.toFixed(6)}
            </span>{" "}
            (must be 1)
          </p>

          {/* Node A */}
          <div className="border border-gray-100 p-3 rounded mb-2">
            <h3 className="font-medium mb-2">Node A</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                Direct Stake (t<sub>nA</sub>)
                <input
                  type="number"
                  className="appearance-none border px-2 py-1 w-full rounded mt-1"
                  value={nodeAStake}
                  onChange={(e) =>
                    setNodeAStake(parseFloat(e.target.value) || 0)
                  }
                />
              </label>
              <label className="block">
                Delegators' Stake (t<sub>dA</sub>)
                <input
                  type="number"
                  className="appearance-none border px-2 py-1 w-full rounded mt-1"
                  value={nodeADelegators}
                  onChange={(e) =>
                    setNodeADelegators(parseFloat(e.target.value) || 0)
                  }
                />
              </label>
              <label className="block">
                Performance (g<sub>A</sub>)
                <input
                  type="number"
                  step="0.000001"
                  className="appearance-none border px-2 py-1 w-full rounded mt-1"
                  value={nodeAScore}
                  onChange={(e) =>
                    setNodeAScore(parseFloat(e.target.value) || 0)
                  }
                />
              </label>
              <label className="block">
                σ<sub>A</sub> (Reward Ratio = 1 - σ)
                <input
                  type="number"
                  step="0.1"
                  className="appearance-none border px-2 py-1 w-full rounded mt-1"
                  value={nodeASigma}
                  onChange={(e) =>
                    setNodeASigma(parseFloat(e.target.value) || 0)
                  }
                />
              </label>
            </div>
          </div>

          {/* Node B */}
          <div className="border border-gray-100 p-3 rounded mb-2">
            <h3 className="font-medium mb-2">Node B</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                Direct Stake (t<sub>nB</sub>)
                <input
                  type="number"
                  className="appearance-none border px-2 py-1 w-full rounded mt-1"
                  value={nodeBStake}
                  onChange={(e) =>
                    setNodeBStake(parseFloat(e.target.value) || 0)
                  }
                />
              </label>
              <label className="block">
                Delegators' Stake (t<sub>dB</sub>)
                <input
                  type="number"
                  className="appearance-none border px-2 py-1 w-full rounded mt-1"
                  value={nodeBDelegators}
                  onChange={(e) =>
                    setNodeBDelegators(parseFloat(e.target.value) || 0)
                  }
                />
              </label>
              <label className="block">
                Performance (g<sub>B</sub>)
                <input
                  type="number"
                  step="0.000001"
                  className="appearance-none border px-2 py-1 w-full rounded mt-1"
                  value={nodeBScore}
                  onChange={(e) =>
                    setNodeBScore(parseFloat(e.target.value) || 0)
                  }
                />
              </label>
              <label className="block">
                σ<sub>B</sub> (Reward Ratio = 1 - σ)
                <input
                  type="number"
                  step="0.1"
                  className="appearance-none border px-2 py-1 w-full rounded mt-1"
                  value={nodeBSigma}
                  onChange={(e) =>
                    setNodeBSigma(parseFloat(e.target.value) || 0)
                  }
                />
              </label>
            </div>
          </div>

          {/* Node C */}
          <div className="border border-gray-100 p-3 rounded mb-2">
            <h3 className="font-medium mb-2">Node C</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                Direct Stake (t<sub>nC</sub>)
                <input
                  type="number"
                  className="appearance-none border px-2 py-1 w-full rounded mt-1"
                  value={nodeCStake}
                  onChange={(e) =>
                    setNodeCStake(parseFloat(e.target.value) || 0)
                  }
                />
              </label>
              <label className="block">
                Delegators' Stake (t<sub>dC</sub>)
                <input
                  type="number"
                  className="appearance-none border px-2 py-1 w-full rounded mt-1"
                  value={nodeCDelegators}
                  onChange={(e) =>
                    setNodeCDelegators(parseFloat(e.target.value) || 0)
                  }
                />
              </label>
              <label className="block">
                Performance (g<sub>C</sub>)
                <input
                  type="number"
                  step="0.000001"
                  className="appearance-none border px-2 py-1 w-full rounded mt-1"
                  value={nodeCScore}
                  onChange={(e) =>
                    setNodeCScore(parseFloat(e.target.value) || 0)
                  }
                />
              </label>
              <label className="block">
                σ<sub>C</sub> (Reward Ratio = 1 - σ)
                <input
                  type="number"
                  step="0.1"
                  className="appearance-none border px-2 py-1 w-full rounded mt-1"
                  value={nodeCSigma}
                  onChange={(e) =>
                    setNodeCSigma(parseFloat(e.target.value) || 0)
                  }
                />
              </label>
            </div>
          </div>

          {/* VALIDATORS */}
          <h2 className="font-semibold mb-2 mt-4">Validators</h2>
          <p className="text-sm text-gray-600 mb-2">
            Validator Score Sum:{" "}
            <span
              className={
                Math.abs(valScoreSum - 1) < 1e-9 ? "text-green-600" : "text-red-600"
              }
            >
              {valScoreSum.toFixed(6)}
            </span>{" "}
            (must be 1)
          </p>

          {/* Validator A */}
          <div className="border border-gray-100 p-3 rounded mb-2">
            <h3 className="font-medium mb-2">Validator A</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                Direct Stake (S<sub>vA</sub>)
                <input
                  type="number"
                  className="appearance-none border px-2 py-1 w-full rounded mt-1"
                  value={valAStake}
                  onChange={(e) =>
                    setValAStake(parseFloat(e.target.value) || 0)
                  }
                />
              </label>
              <label className="block">
                Delegators' Stake (S<sub>dA</sub>)
                <input
                  type="number"
                  className="appearance-none border px-2 py-1 w-full rounded mt-1"
                  value={valADelegators}
                  onChange={(e) =>
                    setValADelegators(parseFloat(e.target.value) || 0)
                  }
                />
              </label>
              <label className="block">
                Performance (F<sub>A</sub>)
                <input
                  type="number"
                  step="0.000001"
                  className="appearance-none border px-2 py-1 w-full rounded mt-1"
                  value={valAScore}
                  onChange={(e) =>
                    setValAScore(parseFloat(e.target.value) || 0)
                  }
                />
              </label>
              <label className="block">
                σ<sub>ValA</sub> (Reward Ratio = 1 - σ)
                <input
                  type="number"
                  step="0.1"
                  className="appearance-none border px-2 py-1 w-full rounded mt-1"
                  value={valASigma}
                  onChange={(e) =>
                    setValASigma(parseFloat(e.target.value) || 0)
                  }
                />
              </label>
            </div>
          </div>

          {/* Validator B */}
          <div className="border border-gray-100 p-3 rounded mb-2">
            <h3 className="font-medium mb-2">Validator B</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                Direct Stake (S<sub>vB</sub>)
                <input
                  type="number"
                  className="appearance-none border px-2 py-1 w-full rounded mt-1"
                  value={valBStake}
                  onChange={(e) =>
                    setValBStake(parseFloat(e.target.value) || 0)
                  }
                />
              </label>
              <label className="block">
                Delegators' Stake (S<sub>dB</sub>)
                <input
                  type="number"
                  className="appearance-none border px-2 py-1 w-full rounded mt-1"
                  value={valBDelegators}
                  onChange={(e) =>
                    setValBDelegators(parseFloat(e.target.value) || 0)
                  }
                />
              </label>
              <label className="block">
                Performance (F<sub>B</sub>)
                <input
                  type="number"
                  step="0.000001"
                  className="appearance-none border px-2 py-1 w-full rounded mt-1"
                  value={valBScore}
                  onChange={(e) =>
                    setValBScore(parseFloat(e.target.value) || 0)
                  }
                />
              </label>
              <label className="block">
                σ<sub>ValB</sub> (Reward Ratio = 1 - σ)
                <input
                  type="number"
                  step="0.1"
                  className="appearance-none border px-2 py-1 w-full rounded mt-1"
                  value={valBSigma}
                  onChange={(e) =>
                    setValBSigma(parseFloat(e.target.value) || 0)
                  }
                />
              </label>
            </div>
          </div>

          {/* Validator C */}
          <div className="border border-gray-100 p-3 rounded mb-2">
            <h3 className="font-medium mb-2">Validator C</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                Direct Stake (S<sub>vC</sub>)
                <input
                  type="number"
                  className="appearance-none border px-2 py-1 w-full rounded mt-1"
                  value={valCStake}
                  onChange={(e) =>
                    setValCStake(parseFloat(e.target.value) || 0)
                  }
                />
              </label>
              <label className="block">
                Delegators' Stake (S<sub>dC</sub>)
                <input
                  type="number"
                  className="appearance-none border px-2 py-1 w-full rounded mt-1"
                  value={valCDelegators}
                  onChange={(e) =>
                    setValCDelegators(parseFloat(e.target.value) || 0)
                  }
                />
              </label>
              <label className="block">
                Performance (F<sub>C</sub>)
                <input
                  type="number"
                  step="0.000001"
                  className="appearance-none border px-2 py-1 w-full rounded mt-1"
                  value={valCScore}
                  onChange={(e) =>
                    setValCScore(parseFloat(e.target.value) || 0)
                  }
                />
              </label>
              <label className="block">
                σ<sub>ValC</sub> (Reward Ratio = 1 - σ)
                <input
                  type="number"
                  step="0.1"
                  className="appearance-none border px-2 py-1 w-full rounded mt-1"
                  value={valCSigma}
                  onChange={(e) =>
                    setValCSigma(parseFloat(e.target.value) || 0)
                  }
                />
              </label>
            </div>
          </div>

          {/* Compute Button */}
          <button
            onClick={handleCompute}
            className="mt-4 w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            Compute
          </button>
        </div>

        {/* Right Column: 1/3 width => results */}
        <div className="w-full lg:w-1/3 border border-gray-200 rounded p-4">
          <h2 className="text-lg font-semibold mb-4">Results</h2>

          <div className="mb-3">
            <strong>Training Rewards:</strong> {trainingRewards.toFixed(2)}
            <br />
            <strong>Validator Rewards:</strong> {validatorRewards.toFixed(2)}
          </div>

          {/* Step 1 Calc Steps */}
          {step1Calc && (
            <div className="bg-gray-50 p-2 mb-3 text-sm rounded">
              <h3 className="font-medium">Calculation Steps (Step 1)</h3>
              <p>Node Direct Sum: {step1Calc.nodeDirectSum}</p>
              <p>Validator Direct Sum: {step1Calc.validatorDirectSum}</p>
              <p>Note: Direct Sum above means delegated stake is not counted here</p>
              <p>Fraction for Nodes: {step1Calc.fractionNodes.toFixed(4)}</p>
              <p>Training Rewards: {step1Calc.trainingRewards.toFixed(2)}</p>
              <p>Validator Rewards: {step1Calc.validatorRewards.toFixed(2)}</p>
            </div>
          )}

          {/* Node Distribution Steps */}
          {nodeCalcDetails.length > 0 && (
            <div className="bg-gray-50 p-2 mb-3 text-sm rounded">
              <h3 className="font-medium">Node Distribution (Steps 2–3)</h3>
              {nodeCalcDetails.map((nd) => (
                <div key={nd.index} className="mb-2 border-b border-gray-100 pb-2">
                  <p className="font-semibold">
                    Node {["A", "B", "C"][nd.index]}
                  </p>
                  <p>Direct Stake: {nd.directStake}</p>
                  <p>Delegators Stake: {nd.delegatorsStake}</p>
                  <p>Total Stake: {nd.totalStake}</p>
                  <p>Performance: {nd.performance.toFixed(6)}</p>
                  <p>Fraction: {nd.fraction.toFixed(4)}</p>
                  <p>
                    Total Reward (before split):{" "}
                    {nd.totalRewardBeforeSplit.toFixed(2)}
                  </p>
                  <p>Node Owner Reward: {nd.nodeOwnerReward.toFixed(2)}</p>
                  <p>Node Delegators: {nd.nodeDelegatorsReward.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}

          {/* Final Node Results */}
          <h3 className="font-medium">Node A</h3>
          <p>Node A’s final: {nodeAResult.toFixed(2)}</p>
          <p>Delegators of A: {nodeADelegatorsResult.toFixed(2)}</p>

          <h3 className="font-medium mt-2">Node B</h3>
          <p>Node B’s final: {nodeBResult.toFixed(2)}</p>
          <p>Delegators of B: {nodeBDelegatorsResult.toFixed(2)}</p>

          <h3 className="font-medium mt-2">Node C</h3>
          <p>Node C’s final: {nodeCResult.toFixed(2)}</p>
          <p>Delegators of C: {nodeCDelegatorsResult.toFixed(2)}</p>

          <hr className="my-2" />

          {/* Validator Distribution Steps */}
          {valCalcDetails.length > 0 && (
            <div className="bg-gray-50 p-2 mb-3 text-sm rounded">
              <h3 className="font-medium">Validator Distribution (Steps 2–3)</h3>
              {valCalcDetails.map((vd) => (
                <div key={vd.index} className="mb-2 border-b border-gray-100 pb-2">
                  <p className="font-semibold">
                    Validator {["A", "B", "C"][vd.index]}
                  </p>
                  <p>Direct Stake: {vd.directStake}</p>
                  <p>Delegators Stake: {vd.delegatorsStake}</p>
                  <p>Total Stake: {vd.totalStake}</p>
                  <p>Performance: {vd.performance.toFixed(6)}</p>
                  <p>Fraction: {vd.fraction.toFixed(4)}</p>
                  <p>
                    Total Reward (before split):{" "}
                    {vd.totalRewardBeforeSplit.toFixed(2)}
                  </p>
                  <p>Validator Owner: {vd.validatorOwnerReward.toFixed(2)}</p>
                  <p>Validator Delegators: {vd.validatorDelegatorsReward.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}

          {/* Final Validator Results */}
          <h3 className="font-medium">Validator A</h3>
          <p>Validator A’s final: {valAResult.toFixed(2)}</p>
          <p>Delegators of A: {valADelegatorsResult.toFixed(2)}</p>

          <h3 className="font-medium mt-2">Validator B</h3>
          <p>Validator B’s final: {valBResult.toFixed(2)}</p>
          <p>Delegators of B: {valBDelegatorsResult.toFixed(2)}</p>

          <h3 className="font-medium mt-2">Validator C</h3>
          <p>Validator C’s final: {valCResult.toFixed(2)}</p>
          <p>Delegators of C: {valCDelegatorsResult.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
