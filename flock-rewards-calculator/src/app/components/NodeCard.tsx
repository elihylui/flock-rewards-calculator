export default function NodeCard({
  nodeLabel,
  nodeParams,
  setNodeParams,
}: {
  nodeLabel: string;
  nodeParams: {
    stake: number;
    delegators: number;
    score: number;
    sigma: number;
  };
  setNodeParams: (value: Partial<typeof nodeParams>) => void;
}) {
  return (
    <div className="border border-gray-100 p-3 rounded mb-2">
      <h3 className="font-medium mb-2">Node {nodeLabel}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          Direct Stake (t<sub>n{nodeLabel}</sub>)
          <input
            type="number"
            className="appearance-none border px-2 py-1 w-full rounded mt-1"
            value={nodeParams.stake}
            onChange={(e) =>
              setNodeParams({ ...nodeParams, stake: parseFloat(e.target.value) || 0 })
            }
          />
        </label>
        <label className="block">
          Delegators' Stake (t<sub>d{nodeLabel}</sub>)
          <input
            type="number"
            className="appearance-none border px-2 py-1 w-full rounded mt-1"
            value={nodeParams.delegators}
            onChange={(e) =>
              setNodeParams({ ...nodeParams, delegators: parseFloat(e.target.value) || 0 })
            }
          />
        </label>
        <label className="block">
          Performance (g<sub>{nodeLabel}</sub>)
          <input
            type="number"
            step="0.000001"
            className="appearance-none border px-2 py-1 w-full rounded mt-1"
            value={nodeParams.score}
            onChange={(e) =>
              setNodeParams({ ...nodeParams, score: parseFloat(e.target.value) || 0 })
            }
          />
        </label>
        <label className="block">
          σ<sub>{nodeLabel}</sub> (Reward Ratio = 1 - σ)
          <input
            type="number"
            step="0.1"
            className="appearance-none border px-2 py-1 w-full rounded mt-1"
            value={nodeParams.sigma}
            onChange={(e) =>
              setNodeParams({ ...nodeParams, sigma: parseFloat(e.target.value) || 0 })
            }
          />
        </label>
      </div>
    </div>
  );
}
