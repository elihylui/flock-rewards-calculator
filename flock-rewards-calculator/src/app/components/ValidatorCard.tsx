export default function ValidatorCard({
  validatorLabel,
  validatorParams,
  setValidatorParams,
}: {
  validatorLabel: string;
  validatorParams: {
    stake: number;
    delegators: number;
    score: number;
    sigma: number;
  };
  setValidatorParams: (value: Partial<typeof validatorParams>) => void;
}) {
  return (
    <div className="border border-gray-100 p-3 rounded mb-2">
      <h3 className="font-medium mb-2">Validator {validatorLabel}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          Direct Stake (S<sub>v{validatorLabel}</sub>)
          <input
            type="number"
            className="appearance-none border px-2 py-1 w-full rounded mt-1"
            value={validatorParams.stake}
            onChange={(e) =>
              setValidatorParams({ ...validatorParams, stake: parseFloat(e.target.value) || 0 })
            }
          />
        </label>
        <label className="block">
          Delegators' Stake (S<sub>d{validatorLabel}</sub>)
          <input
            type="number"
            className="appearance-none border px-2 py-1 w-full rounded mt-1"
            value={validatorParams.delegators}
            onChange={(e) =>
              setValidatorParams({ ...validatorParams, delegators: parseFloat(e.target.value) || 0 })
            }
          />
        </label>
        <label className="block">
          Performance (F<sub>{validatorLabel}</sub>)
          <input
            type="number"
            step="0.000001"
            className="appearance-none border px-2 py-1 w-full rounded mt-1"
            value={validatorParams.score}
            onChange={(e) =>
              setValidatorParams({ ...validatorParams, score: parseFloat(e.target.value) || 0 })
            }
          />
        </label>
        <label className="block">
        σ<sub>Val{validatorLabel}</sub> (Reward Ratio = 1 - σ)
          <input
            type="number"
            step="0.1"
            className="appearance-none border px-2 py-1 w-full rounded mt-1"
            value={validatorParams.sigma}
            onChange={(e) =>
              setValidatorParams({ ...validatorParams, sigma: parseFloat(e.target.value) || 0 })
            }
          />
        </label>
      </div>
    </div>
  );
}
