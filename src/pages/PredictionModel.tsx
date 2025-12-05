// src/pages/PredictionModel.tsx
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
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
import { calculateKFSScore } from '../utils/kfsScore';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PredictionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const ResultCard = styled(Card)`
  margin-top: 1rem;
  background: ${props => props.theme.colors.bg.secondary};
  text-align: center;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
`;

const SuccessIndicator = styled.div<{ score: number }>`
  display: inline-block;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => 
    props.score > 50 ?
    props.theme.colors.success :
    props.score > 35 ? props.theme.colors.warning :
    props.theme.colors.danger
  };
  color: white;
  font-weight: 600;
  margin-top: ${props => props.theme.spacing.md};
`;

const PlayerSelect = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.bg.tertiary};
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text.primary};
  font-size: 1rem;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  option {
    background: ${props => props.theme.colors.bg.secondary};
    color: ${props => props.theme.colors.text.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};
`;

const ScoreBreakdown = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${props => props.theme.borderRadius.lg};
  text-align: left;
`;

const BreakdownItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

interface PredictionModelProps {
  kboData: Player[];
  preKboData: Player[];
  aaaData?: Player[];
}

function PredictionModel({ kboData, preKboData, aaaData = [] }: PredictionModelProps) {
  const [inputs, setInputs] = useState({
    wrcPlus: '',
    kRate: '',
    bbRate: '',
    hr: '',
    pa: '',
    age: '',
    babip: '',
    obp: '',
    slg: '',
    swstrPct: '',
    gdp: '',
    avg: '',
    woba: ''
  });

  const [prediction, setPrediction] = useState<{
    score: number;
    predictedWrcPlus: number;
    successProbability: number;
    breakdown: {
      discipline: number;
      power: number;
      contact: number;
      value: number;
      experience: number;
    };
  } | null>(null);
  const [selectedAAAPlayer, setSelectedAAAPlayer] = useState<string>('');

  const handlePlayerSelect = (playerName: string) => {
    setSelectedAAAPlayer(playerName);
    if (playerName) {
      const player = aaaData.find(p => p.name === playerName);
      if (player) {
        setInputs({
          wrcPlus: (player.wrc_plus || 0).toString(),
          kRate: (player.k_pct || 0).toString(),
          bbRate: (player.bb_pct || 0).toString(),
          hr: (player.hr || 0).toString(),
          pa: (player.pa || 0).toString(),
          age: (player.age || 0).toString(),
          babip: (player.babip || 0).toString(),
          obp: (player.obp || 0).toString(),
          slg: (player.slg || 0).toString(),
          swstrPct: (player.swstr_pct || 0).toString(),
          gdp: (player.gdp || 0).toString(),
          avg: (player.avg || 0).toString(),
          woba: (player.woba || 0).toString(),
        });
      }
    }
  };

  const calculateKSuccessScore = () => {
    const result = calculateKFSScore({
      wrcPlus: parseFloat(inputs.wrcPlus) || 100,
      kPct: parseFloat(inputs.kRate) || 20,
      bbPct: parseFloat(inputs.bbRate) || 8,
      hr: parseFloat(inputs.hr) || 10,
      pa: parseFloat(inputs.pa) || 300,
      babip: parseFloat(inputs.babip) || 0.300,
      obp: parseFloat(inputs.obp) || 0.320,
      slg: parseFloat(inputs.slg) || 0.400,
      gdp: parseFloat(inputs.gdp) || 10,
      avg: parseFloat(inputs.avg) || 0.280,
      woba: parseFloat(inputs.woba) || 0.350,
    });

    setPrediction(result);
  };

  const getSuccessMessage = (score: number) => {
    if (score >= 65) return '💎 S급: 리그 폭격 가능성 (Elite)';
    if (score >= 50) return '🌟 A급: 매우 높은 성공 가능성 (Low Risk)';
    if (score >= 35) return '✅ B급: 준수한 활약 예상 (Moderate)';
    if (score >= 20) return '⚠️ C급: 적응 변수 존재 (High Risk)';
    return '❌ D급: 매우 높은 실패 위험 (Critical)';
  };

  const sortedAAAPlayers = [...aaaData]
    .filter(p => p.wrc_plus && p.pa && p.pa > 200)
    .sort((a, b) => (b.wrc_plus || 0) - (a.wrc_plus || 0));

  return (
    <PredictionContainer>
      <Card>
        <CardTitle>🔮 KBO Foreigner Success Score 계산기</CardTitle>
        <StatLabel>
          선수의 Pre-KBO 통계를 입력하여 KBO 성적을 예측합니다.
          이 점수는 DIKW 분석을 기반으로 K% 안정성(r≈0.50)과 
          제한적인 wRC+ 전이성(r≈-0.12)을 반영합니다.
        </StatLabel>
        
        {aaaData && aaaData.length > 0 && (
          <InputGroup style={{ marginTop: '1.5rem' }}>
            <Label>🎯 2025 AAA 선수 선택 (200 PA 이상)</Label>
            <PlayerSelect
              value={selectedAAAPlayer}
              onChange={(e) => handlePlayerSelect(e.target.value)}
            >
              <option value="">직접 입력하거나 AAA 선수를 선택하세요...</option>
              {sortedAAAPlayers.slice(0, 100).map(player => (
                <option key={player.name} value={player.name}>
                  {player.name} ({player.team}) - wRC+ {player.wrc_plus} | {player.hr}HR | K% {player.k_pct?.toFixed(1)}
                </option>
              ))}
            </PlayerSelect>
          </InputGroup>
        )}
        
        <FormGrid>
          <InputGroup>
            <Label>wRC+ (Pre-KBO)</Label>
            <Input
              type="number"
              placeholder="예: 120"
              value={inputs.wrcPlus}
              onChange={e => setInputs({...inputs, wrcPlus: e.target.value})}
            />
          </InputGroup>
          
          <InputGroup>
            <Label>K% (삼진율)</Label>
            <Input
              type="number"
              placeholder="예: 20.5"
              value={inputs.kRate}
              onChange={e => setInputs({...inputs, kRate: e.target.value})}
            />
          </InputGroup>
          
          <InputGroup>
            <Label>BB% (볼넷율)</Label>
            <Input
              type="number"
              placeholder="예: 10.2"
              value={inputs.bbRate}
              onChange={e => setInputs({...inputs, bbRate: e.target.value})}
            />
          </InputGroup>
          
          <InputGroup>
            <Label>홈런</Label>
            <Input
              type="number"
              placeholder="예: 25"
              value={inputs.hr}
              onChange={e => setInputs({...inputs, hr: e.target.value})}
            />
          </InputGroup>
          
          <InputGroup>
            <Label>타석 (PA)</Label>
            <Input
              type="number"
              placeholder="예: 450"
              value={inputs.pa}
              onChange={e => setInputs({...inputs, pa: e.target.value})}
            />
          </InputGroup>
          
          <InputGroup>
            <Label>GDP (병살타)</Label>
            <Input
              type="number"
              placeholder="예: 12"
              value={inputs.gdp}
              onChange={e => setInputs({...inputs, gdp: e.target.value})}
            />
          </InputGroup>

          <InputGroup>
            <Label>AVG (타율)</Label>
            <Input
              type="number"
              step="0.001"
              placeholder="예: 0.280"
              value={inputs.avg}
              onChange={e => setInputs({...inputs, avg: e.target.value})}
            />
          </InputGroup>

          <InputGroup>
            <Label>BABIP</Label>
            <Input
              type="number"
              step="0.001"
              placeholder="예: 0.320"
              value={inputs.babip}
              onChange={e => setInputs({...inputs, babip: e.target.value})}
            />
          </InputGroup>

          <InputGroup>
            <Label>OBP (출루율)</Label>
            <Input
              type="number"
              step="0.001"
              placeholder="예: 0.380"
              value={inputs.obp}
              onChange={e => setInputs({...inputs, obp: e.target.value})}
            />
          </InputGroup>

          <InputGroup>
            <Label>SLG (장타율)</Label>
            <Input
              type="number"
              step="0.001"
              placeholder="예: 0.500"
              value={inputs.slg}
              onChange={e => setInputs({...inputs, slg: e.target.value})}
            />
          </InputGroup>

          <InputGroup>
            <Label>wOBA</Label>
            <Input
              type="number"
              step="0.001"
              placeholder="예: 0.350"
              value={inputs.woba}
              onChange={e => setInputs({...inputs, woba: e.target.value})}
            />
          </InputGroup>
        </FormGrid>
        
        <ButtonGroup>
          <Button onClick={calculateKSuccessScore}>
            KFS Score 계산하기
          </Button>
          {selectedAAAPlayer && (
            <Button 
              onClick={() => {
                setSelectedAAAPlayer('');
                setInputs({
                  wrcPlus: '',
                  kRate: '',
                  bbRate: '',
                  hr: '',
                  pa: '',
                  age: '',
                  babip: '',
                  obp: '',
                  slg: '',
                  swstrPct: '',
                  gdp: '',
                  avg: '',
                  woba: ''
                });
              }}
              style={{ background: 'rgba(234, 67, 53, 0.8)' }}
            >
              초기화
            </Button>
          )}
        </ButtonGroup>
      </Card>
      
      {prediction !== null && (
        <ResultCard>
          <CardTitle style={{ color: 'white' }}>
            KFS Score
          </CardTitle>
          <StatValue style={{ 
            WebkitTextFillColor: 'white',
            color: 'white',
            fontSize: '3.5rem'
          }}>
            {prediction.score}
          </StatValue>
          <SuccessIndicator score={prediction.score}>
            {getSuccessMessage(prediction.score)}
          </SuccessIndicator>

          <ScoreBreakdown>
            <h4 style={{ 
              color: 'white',
              marginBottom: '1rem',
              fontSize: '1.1rem'
            }}>
              점수 세부 구성 (No Caps)
            </h4>
            <BreakdownItem>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                Discipline (K%, BB%)
              </span>
              <span style={{ 
                color: 'white',
                fontWeight: 700
              }}>
                {prediction.breakdown.discipline}
              </span>
            </BreakdownItem>
            <BreakdownItem>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                Power (HR)
              </span>
              <span style={{ 
                color: 'white',
                fontWeight: 700
              }}>
                {prediction.breakdown.power}
              </span>
            </BreakdownItem>
            <BreakdownItem>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                Contact & Quality (Avg, BABIP)
              </span>
              <span style={{ 
                color: 'white',
                fontWeight: 700
              }}>
                {prediction.breakdown.contact}
              </span>
            </BreakdownItem>
            <BreakdownItem>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                Value (OBP, SLG, wOBA, wRC+)
              </span>
              <span style={{ 
                color: 'white',
                fontWeight: 700
              }}>
                {prediction.breakdown.value}
              </span>
            </BreakdownItem>
            <BreakdownItem>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                Experience (GDP)
              </span>
              <span style={{ 
                color: 'white',
                fontWeight: 700
              }}>
                {prediction.breakdown.experience}
              </span>
            </BreakdownItem>
          </ScoreBreakdown>
        </ResultCard>
      )}
    </PredictionContainer>
  );
}

export default PredictionModel;
