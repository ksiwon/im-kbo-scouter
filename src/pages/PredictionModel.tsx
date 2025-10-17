// src/pages/PredictionModel.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Card, 
  CardTitle, 
  StatLabel, 
  StatValue, 
  InputGroup, 
  Label, 
  Input, 
  Button 
} from '../components/Common';
import { Player } from '../types';

const PredictionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xl};
`;

const ResultCard = styled(Card)`
  margin-top: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.gradient.success};
  text-align: center;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.lg};
`;

const SuccessIndicator = styled.div<{ score: number }>`
  display: inline-block;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => 
    props.score > 100 ? props.theme.colors.success :
    props.score > 50 ? props.theme.colors.warning :
    props.theme.colors.danger
  };
  color: white;
  font-weight: 600;
  margin-top: ${props => props.theme.spacing.md};
`;

interface PredictionModelProps {
  kboData: Player[];
  preKboData: Player[];
}

function PredictionModel({ kboData, preKboData }: PredictionModelProps) {
  const [inputs, setInputs] = useState({
    wrcPlus: '',
    kRate: '',
    bbRate: '',
    hr: '',
  });
  const [prediction, setPrediction] = useState<number | null>(null);

  const calculateKSuccessScore = () => {
    // Simple weighted formula based on DIKW Knowledge
    const wrc = parseFloat(inputs.wrcPlus) || 0;
    const k = parseFloat(inputs.kRate) || 0;
    const bb = parseFloat(inputs.bbRate) || 0;
    const hr = parseFloat(inputs.hr) || 0;
    
    // Weights based on correlation analysis
    // wRC+ has limited transfer but still considered
    // K% is stable (0.5 correlation) but higher = worse
    // BB% is moderately stable (0.29 correlation)
    // HR is a strong indicator
    const score = (wrc * 0.3) + (hr * 2) - (k * 0.5) + (bb * 1.5);
    setPrediction(Math.round(score * 10) / 10);
  };

  const getSuccessMessage = (score: number) => {
    if (score > 100) return '🌟 High Success Probability';
    if (score > 50) return '⚠️ Moderate Risk';
    return '❌ High Risk';
  };

  return (
    <PredictionContainer>
      <Card>
        <CardTitle>🔮 K-Success Score Calculator</CardTitle>
        <StatLabel>
          Enter a player's Pre-KBO statistics to predict KBO performance.
          This model is based on the DIKW analysis showing K% stability (r≈0.50) 
          and limited wRC+ transferability (r≈-0.12).
        </StatLabel>
        
        <FormGrid>
          <InputGroup>
            <Label>wRC+ (Pre-KBO)</Label>
            <Input
              type="number"
              placeholder="e.g., 120"
              value={inputs.wrcPlus}
              onChange={e => setInputs({...inputs, wrcPlus: e.target.value})}
            />
          </InputGroup>
          
          <InputGroup>
            <Label>K% (Strikeout Rate)</Label>
            <Input
              type="number"
              placeholder="e.g., 20.5"
              value={inputs.kRate}
              onChange={e => setInputs({...inputs, kRate: e.target.value})}
            />
          </InputGroup>
          
          <InputGroup>
            <Label>BB% (Walk Rate)</Label>
            <Input
              type="number"
              placeholder="e.g., 10.2"
              value={inputs.bbRate}
              onChange={e => setInputs({...inputs, bbRate: e.target.value})}
            />
          </InputGroup>
          
          <InputGroup>
            <Label>Home Runs</Label>
            <Input
              type="number"
              placeholder="e.g., 25"
              value={inputs.hr}
              onChange={e => setInputs({...inputs, hr: e.target.value})}
            />
          </InputGroup>
        </FormGrid>
        
        <div style={{ marginTop: '24px' }}>
          <Button onClick={calculateKSuccessScore}>
            Calculate K-Success Score
          </Button>
        </div>
      </Card>
      
      {prediction !== null && (
        <ResultCard>
          <CardTitle style={{ color: 'white' }}>
            Predicted K-Success Score
          </CardTitle>
          <StatValue style={{ 
            WebkitTextFillColor: 'white',
            color: 'white',
            fontSize: '3rem'
          }}>
            {prediction}
          </StatValue>
          <SuccessIndicator score={prediction}>
            {getSuccessMessage(prediction)}
          </SuccessIndicator>
          <StatLabel style={{ 
            color: 'rgba(255,255,255,0.9)',
            marginTop: '16px' 
          }}>
            Based on plate discipline stability and power metrics
          </StatLabel>
        </ResultCard>
      )}
    </PredictionContainer>
  );
}

export default PredictionModel;