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
    props.score > 80 ? props.theme.colors.success :
    props.score > 60 ? props.theme.colors.warning :
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
  margin-top: 2rem;
  padding: 1.5rem;
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
    ldPct: '',
    swstrPct: '',
  });
  const [prediction, setPrediction] = useState<{
    score: number;
    predictedWrcPlus: number;
    successProbability: number;
    breakdown: {
      discipline: number;
      power: number;
      onBase: number;
      babip: number;
      experience: number;
      wrc: number;
    };
  } | null>(null);
  const [selectedAAAPlayer, setSelectedAAAPlayer] = useState<string>('');

  // AAA 선수 선택 시 자동으로 입력
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
          ldPct: (player.ld_pct || 0).toString(),
          swstrPct: (player.swstr_pct || 0).toString(),
        });
      }
    }
  };

  const calculateKSuccessScore = () => {
    // 입력값 파싱
    const wrcPlus = parseFloat(inputs.wrcPlus) || 100;
    const kPct = parseFloat(inputs.kRate) || 20;
    const bbPct = parseFloat(inputs.bbRate) || 8;
    const hr = parseFloat(inputs.hr) || 10;
    const pa = parseFloat(inputs.pa) || 300;
    const age = parseFloat(inputs.age) || 28;
    const babip = parseFloat(inputs.babip) || 0.300;
    const obp = parseFloat(inputs.obp) || 0.320;
    const slg = parseFloat(inputs.slg) || 0.400;
    const ldPct = parseFloat(inputs.ldPct) || 20;
    const swstrPct = parseFloat(inputs.swstrPct) || 10;
    
    // DIKW 분석 기반 가중치
    // K% 안정성: r ≈ 0.50 (중간 상관관계) - 높은 가중치
    // BB% 안정성: r ≈ 0.29 (약한 상관관계) - 중간 가중치
    // wRC+ 전이: r ≈ -0.12 (제한적) - 낮은 가중치
    
    // 1. 플레이트 디시플린 점수 (0-35점)
    const kScore = Math.max(0, (25 - kPct) * 1.2);
    const bbScore = Math.max(0, (bbPct - 5) * 1.0);
    const swstrScore = Math.max(0, (15 - swstrPct) * 0.8);
    const disciplineScore = Math.min(35, kScore + bbScore + swstrScore);
    
    // 2. 파워 및 타구 품질 점수 (0-30점)
    const powerScore = Math.min(15, (hr / pa) * 1000 * 0.75);
    const ldScore = Math.max(0, (ldPct - 18) * 0.4);
    const batQualityScore = Math.min(30, powerScore + ldScore);
    
    // 3. 출루 및 장타 능력 점수 (0-20점)
    const obpScore = Math.max(0, (obp - 0.300) * 50);
    const slgScore = Math.max(0, (slg - 0.350) * 30);
    const onBaseScore = Math.min(20, obpScore + slgScore);
    
    // 4. BABIP 안정성 점수 (0-10점)
    const babipScore = babip > 0.380 ? Math.max(0, 10 - (babip - 0.380) * 30) :
                       babip < 0.280 ? Math.max(0, (babip - 0.250) * 30) :
                       10;
    
    // 5. 나이 및 경험 점수 (0-10점)
    const ageScore = Math.max(0, Math.min(10, (32 - age) * 0.7));
    const paScore = Math.min(5, (pa - 200) / 80);
    const experienceScore = ageScore + paScore;
    
    // 6. wRC+ 기반 점수 (0-15점) - 낮은 가중치
    const wrcScore = Math.max(0, Math.min(15, (wrcPlus - 80) * 0.25));
    
    // 총점 계산
    const totalScore = Math.max(0, Math.min(100,
      disciplineScore + batQualityScore + onBaseScore + 
      babipScore + experienceScore + wrcScore
    ));
    
    // 예상 KBO wRC+
    const disciplineFactor = (100 - kPct * 2 + bbPct * 1.5) / 100;
    const predictedWrcPlus = Math.round(
      wrcPlus * 0.75 + 100 * 0.25 + disciplineFactor * 5
    );
    
    // 성공 확률
    const successProbability = Math.min(95, Math.max(5, 
      totalScore * 0.9 + (kPct < 20 ? 5 : 0) + (bbPct > 10 ? 5 : 0)
    ));
    
    setPrediction({
      score: Math.round(totalScore),
      predictedWrcPlus,
      successProbability: Math.round(successProbability),
      breakdown: {
        discipline: Math.round(disciplineScore),
        power: Math.round(batQualityScore),
        onBase: Math.round(onBaseScore),
        babip: Math.round(babipScore),
        experience: Math.round(experienceScore),
        wrc: Math.round(wrcScore),
      }
    });
  };

  const getSuccessMessage = (score: number) => {
    if (score > 80) return '🌟 매우 높은 성공 가능성';
    if (score > 65) return '✅ 높은 성공 가능성';
    if (score > 50) return '⚠️ 중간 정도의 리스크';
    return '❌ 높은 리스크';
  };

  // AAA 선수 정렬 (wRC+ 높은 순)
  const sortedAAAPlayers = [...aaaData]
    .filter(p => p.wrc_plus && p.pa && p.pa > 200)
    .sort((a, b) => (b.wrc_plus || 0) - (a.wrc_plus || 0));

  return (
    <PredictionContainer>
      <Card>
        <CardTitle>🔮 K-Success Score 계산기</CardTitle>
        <StatLabel>
          선수의 Pre-KBO 통계를 입력하여 KBO 성적을 예측합니다.
          이 모델은 DIKW 분석을 기반으로 K% 안정성(r≈0.50)과 
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
            <Label>나이</Label>
            <Input
              type="number"
              placeholder="예: 26"
              value={inputs.age}
              onChange={e => setInputs({...inputs, age: e.target.value})}
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
            <Label>LD% (라인드라이브)</Label>
            <Input
              type="number"
              placeholder="예: 22"
              value={inputs.ldPct}
              onChange={e => setInputs({...inputs, ldPct: e.target.value})}
            />
          </InputGroup>

          <InputGroup>
            <Label>SwStr% (헛스윙율)</Label>
            <Input
              type="number"
              placeholder="예: 10"
              value={inputs.swstrPct}
              onChange={e => setInputs({...inputs, swstrPct: e.target.value})}
            />
          </InputGroup>
        </FormGrid>
        
        <ButtonGroup>
          <Button onClick={calculateKSuccessScore}>
            K-Success Score 계산하기
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
                  ldPct: '',
                  swstrPct: '',
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
            K-Success Score
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
          
          <div style={{ 
            marginTop: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.5rem',
            color: 'white'
          }}>
            <div>
              <StatLabel style={{ color: 'rgba(255,255,255,0.8)' }}>
                예상 KBO wRC+
              </StatLabel>
              <StatValue style={{ 
                WebkitTextFillColor: 'white',
                color: 'white',
                fontSize: '2rem',
                marginTop: '0.5rem'
              }}>
                {prediction.predictedWrcPlus}
              </StatValue>
            </div>
            <div>
              <StatLabel style={{ color: 'rgba(255,255,255,0.8)' }}>
                성공 확률
              </StatLabel>
              <StatValue style={{ 
                WebkitTextFillColor: 'white',
                color: 'white',
                fontSize: '2rem',
                marginTop: '0.5rem'
              }}>
                {prediction.successProbability}%
              </StatValue>
            </div>
          </div>

          <ScoreBreakdown>
            <h4 style={{ 
              color: 'white',
              marginBottom: '1rem',
              fontSize: '1.1rem'
            }}>
              점수 세부 구성
            </h4>
            <BreakdownItem>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                플레이트 디시플린 (K%, BB%, SwStr%)
              </span>
              <span style={{ 
                color: 'white',
                fontWeight: 700
              }}>
                {prediction.breakdown.discipline}/35
              </span>
            </BreakdownItem>
            <BreakdownItem>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                파워 & 타구 품질 (HR, LD%)
              </span>
              <span style={{ 
                color: 'white',
                fontWeight: 700
              }}>
                {prediction.breakdown.power}/30
              </span>
            </BreakdownItem>
            <BreakdownItem>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                출루 & 장타 (OBP, SLG)
              </span>
              <span style={{ 
                color: 'white',
                fontWeight: 700
              }}>
                {prediction.breakdown.onBase}/20
              </span>
            </BreakdownItem>
            <BreakdownItem>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                BABIP 안정성
              </span>
              <span style={{ 
                color: 'white',
                fontWeight: 700
              }}>
                {prediction.breakdown.babip}/10
              </span>
            </BreakdownItem>
            <BreakdownItem>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                나이 & 경험 (Age, PA)
              </span>
              <span style={{ 
                color: 'white',
                fontWeight: 700
              }}>
                {prediction.breakdown.experience}/10
              </span>
            </BreakdownItem>
            <BreakdownItem>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                wRC+ 점수 (낮은 가중치)
              </span>
              <span style={{ 
                color: 'white',
                fontWeight: 700
              }}>
                {prediction.breakdown.wrc}/15
              </span>
            </BreakdownItem>
          </ScoreBreakdown>
          
          <StatLabel style={{ 
            color: 'rgba(255,255,255,0.9)',
            marginTop: '1.5rem',
            fontSize: '0.9rem'
          }}>
            플레이트 디시플린 안정성과 파워 지표 기반, 다양한 타구 품질 지표 포함
          </StatLabel>
        </ResultCard>
      )}
    </PredictionContainer>
  );
}

export default PredictionModel;