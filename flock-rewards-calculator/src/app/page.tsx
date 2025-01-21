"use client"; // This ensures the component can use client-side React features (state, events, etc.)

import React, { useState } from "react";
import Image from "next/image";

function calculateRewards(
  dailyReward: number,
  nodeStake: number,
  nodeDelegation: number,
  nodeScore: number
) {
  // totalNodeReward = dailyReward * (score * (stake + delegation) / 10000) for demonstration
  const totalStake = nodeStake + nodeDelegation;
  const fraction = nodeScore * totalStake / 10000;
  const totalReward = dailyReward * fraction;

  // Node share & delegator share as an example split (60% / 40%)
  const nodeShare = totalReward * 0.6;
  const delegatorShare = totalReward * 0.4;

  return { totalReward, nodeShare, delegatorShare };
}

export default function Home() {
  // Example states for user inputs
  const [dailyReward, setDailyReward] = useState<number>(309157.68);
  const [nodeStake, setNodeStake] = useState<number>(3000);
  const [nodeDelegation, setNodeDelegation] = useState<number>(1000);
  const [nodeScore, setNodeScore] = useState<number>(0.501435);

  // Results
  const [totalReward, setTotalReward] = useState<number>(0);
  const [nodeShare, setNodeShare] = useState<number>(0);
  const [delegatorShare, setDelegatorShare] = useState<number>(0);

  const handleCompute = () => {
    const { totalReward, nodeShare, delegatorShare } = calculateRewards(
      dailyReward,
      nodeStake,
      nodeDelegation,
      nodeScore
    );
    setTotalReward(totalReward);
    setNodeShare(nodeShare);
    setDelegatorShare(delegatorShare);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-xl">
        {/* LOGO / TITLE */}
        <div className="flex items-center gap-4">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={120}
            height={28}
            priority
          />
          <h1 className="text-xl font-bold">AI Arena Rewards Calculator</h1>
        </div>

        {/* INPUT FORM */}
        <div className="w-full flex flex-col gap-4 p-4 border border-gray-200 rounded">
          <div>
            <label className="block font-medium mb-1">Daily Reward (R0):</label>
            <input
              type="number"
              step="0.01"
              value={dailyReward}
              onChange={(e) => setDailyReward(parseFloat(e.target.value) || 0)}
              className="border px-2 py-1 w-full rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Node Stake (t<sub>n</sub>):
            </label>
            <input
              type="number"
              value={nodeStake}
              onChange={(e) => setNodeStake(parseFloat(e.target.value) || 0)}
              className="border px-2 py-1 w-full rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Delegators' Stake (t<sub>d</sub>):
            </label>
            <input
              type="number"
              value={nodeDelegation}
              onChange={(e) =>
                setNodeDelegation(parseFloat(e.target.value) || 0)
              }
              className="border px-2 py-1 w-full rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Node Performance Score (g<sub>i</sub>):
            </label>
            <input
              type="number"
              step="0.000001"
              value={nodeScore}
              onChange={(e) => setNodeScore(parseFloat(e.target.value) || 0)}
              className="border px-2 py-1 w-full rounded"
            />
          </div>

          <button
            onClick={handleCompute}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            Compute Rewards
          </button>
        </div>

        {/* RESULTS SECTION */}
        <div className="w-full flex flex-col gap-2 p-4 border border-gray-100 rounded">
          <h2 className="text-lg font-semibold">Results</h2>
          <p>
            <strong>Total Reward for Node (incl. Delegators):</strong>{" "}
            {totalReward.toFixed(2)}
          </p>
          <p>
            <strong>Node Share:</strong> {nodeShare.toFixed(2)}
          </p>
          <p>
            <strong>Delegator Share:</strong> {delegatorShare.toFixed(2)}
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Next.js Docs
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/vercel.svg"
            alt="Vercel logo"
            width={16}
            height={16}
          />
          Deploy on Vercel
        </a>
      </footer>
    </div>
  );
}

