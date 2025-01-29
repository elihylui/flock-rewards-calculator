import React, { useState, useEffect } from 'react';
import { LineChart, BarChart, XAxis, YAxis, Tooltip, Legend, Bar, Line, ComposedChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NodeData {
  name: string;
  directStake: number;
  delegatorStake: number;
  performance: number;
  sigma: number;
  r0: number;
  rewards: number;
}

interface RewardsVisualizationProps {
  graphData: number[];
}

const RewardsVisualization: React.FC<RewardsVisualizationProps> = ({ graphData }) => {
  // Convert graphData into preferred format
  const formatData = (data: number[]): NodeData[] => {
    return [
      {
        name: 'Node A',
        directStake: data[0],
        delegatorStake: data[1],
        performance: data[2],
        sigma: data[3],
        r0: data[4],
        rewards: data[5],
      },
      {
        name: 'Node B',
        directStake: data[6],
        delegatorStake: data[7],
        performance: data[8],
        sigma: data[9],
        r0: data[10],
        rewards: data[11],
      },
      {
        name: 'Node C',
        directStake: data[12],
        delegatorStake: data[13],
        performance: data[14],
        sigma: data[15],
        r0: data[16],
        rewards: data[17],
      },
      {
        name: 'Validator A',
        directStake: data[18],
        delegatorStake: data[19],
        performance: data[20],
        sigma: data[21],
        r0: data[22],
        rewards: data[23],
      },
      {
        name: 'Validator B',
        directStake: data[24],
        delegatorStake: data[25],
        performance: data[26],
        sigma: data[27],
        r0: data[28],
        rewards: data[29],
      },
      {
        name: 'Validator C',
        directStake: data[30],
        delegatorStake: data[31],
        performance: data[32],
        sigma: data[33],
        r0: data[34],
        rewards: data[35],
      },
    ];
  };

  const [data, setData] = useState<NodeData[]>(formatData(graphData));

  useEffect(() => {
    setData(formatData(graphData));
  }, [graphData]);

  // Function to recalculate rewards when metrics change
  // const recalculateRewards = (updatedData: NodeData[]): NodeData[] => {
  //   const totalStake = updatedData.reduce((acc, node) => acc + node.directStake + node.delegatorStake, 0);

  //   return updatedData.map(node => ({
  //     ...node,
  //     rewards: (node.directStake + node.delegatorStake) * node.performance * node.sigma * node.r0 * (1000 / totalStake),
  //   }));
  // };

  // Handler for drag events (not yet implemented)
  // const handleDrag = (name: string, newStake: number) => {
  //   const updatedData = data.map(node => (node.name === name ? { ...node, directStake: newStake } : node));
  //   setData(recalculateRewards(updatedData));
  // };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Crypto Rewards Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Combined metrics visualization */}
          <ComposedChart width={700} height={300} data={data}>
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="directStake" fill="#8884d8" name="Direct Stake" />
            <Bar yAxisId="left" dataKey="delegatorStake" fill="#82ca9d" name="Delegator Stake" />
            <Line yAxisId="right" type="monotone" dataKey="rewards" stroke="#ff7300" name="Rewards" />
          </ComposedChart>

          {/* Performance metrics */}
          <LineChart width={700} height={200} data={data}>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="performance" stroke="#8884d8" />
            <Line type="monotone" dataKey="sigma" stroke="#82ca9d" />
            <Line type="monotone" dataKey="r0" stroke="#ffc658" />
          </LineChart>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardsVisualization;
