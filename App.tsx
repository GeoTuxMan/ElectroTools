import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// --- Types ---
type Screen = 'Menu' | 'Resistor' | 'Ohm' | 'Capacitor' | 'Frequency';

// --- Components ---

const Header = ({ title, onBack }: { title: string; onBack?: () => void }) => (
  <View style={styles.header}>
    {onBack && (
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
    )}
    <Text style={styles.headerTitle}>{title}</Text>
  </View>
);

const ResistorCalculator = () => {
  const colors = [
    { name: 'Black', color: '#000', val: 0, mult: 1 },
    { name: 'Brown', color: '#8B4513', val: 1, mult: 10 },
    { name: 'Red', color: '#FF0000', val: 2, mult: 100 },
    { name: 'Orange', color: '#FFA500', val: 3, mult: 1000 },
    { name: 'Yellow', color: '#FFFF00', val: 4, mult: 10000 },
    { name: 'Green', color: '#008000', val: 5, mult: 100000 },
    { name: 'Blue', color: '#0000FF', val: 6, mult: 1000000 },
    { name: 'Violet', color: '#EE82EE', val: 7, mult: 10000000 },
    { name: 'Grey', color: '#808080', val: 8, mult: 100000000 },
    { name: 'White', color: '#FFFFFF', val: 9, mult: 1000000000 },
  ];

  const [band1, setBand1] = useState(1);
  const [band2, setBand2] = useState(0);
  const [multiplier, setMultiplier] = useState(2);

  const resistance = (colors[band1].val * 10 + colors[band2].val) * colors[multiplier].mult;

  const formatRes = (val: number) => {
    if (val >= 1000000) return (val / 1000000).toFixed(1) + ' MΩ';
    if (val >= 1000) return (val / 1000).toFixed(1) + ' kΩ';
    return val + ' Ω';
  };

  return (
    <View style={styles.toolContainer}>
      <View style={styles.resistorVisual}>
        <View style={[styles.band, { backgroundColor: colors[band1].color }]} />
        <View style={[styles.band, { backgroundColor: colors[band2].color }]} />
        <View style={[styles.band, { backgroundColor: colors[multiplier].color }]} />
      </View>
      <Text style={styles.resultValue}>{formatRes(resistance)}</Text>
      
      <ScrollView>
        <Text style={styles.label}>Banda 1:</Text>
        <View style={styles.colorRow}>
          {colors.map((c, i) => (
            <TouchableOpacity key={i} style={[styles.colorSquare, { backgroundColor: c.color, borderWidth: band1 === i ? 2 : 0 }]} onPress={() => setBand1(i)} />
          ))}
        </View>
        <Text style={styles.label}>Banda 2:</Text>
        <View style={styles.colorRow}>
          {colors.map((c, i) => (
            <TouchableOpacity key={i} style={[styles.colorSquare, { backgroundColor: c.color, borderWidth: band2 === i ? 2 : 0 }]} onPress={() => setBand2(i)} />
          ))}
        </View>
        <Text style={styles.label}>Multiplicator:</Text>
        <View style={styles.colorRow}>
          {colors.map((c, i) => (
            <TouchableOpacity key={i} style={[styles.colorSquare, { backgroundColor: c.color, borderWidth: multiplier === i ? 2 : 0 }]} onPress={() => setMultiplier(i)} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const OhmsLaw = () => {
  const [v, setV] = useState('');
  const [i, setI] = useState('');
  const [r, setR] = useState('');

  const calculate = () => {
    const valV = parseFloat(v);
    const valI = parseFloat(i);
    const valR = parseFloat(r);

    if (!isNaN(valV) && !isNaN(valI)) setR((valV / valI).toFixed(2));
    else if (!isNaN(valV) && !isNaN(valR)) setI((valV / valR).toFixed(2));
    else if (!isNaN(valI) && !isNaN(valR)) setV((valI * valR).toFixed(2));
  };

  return (
    <View style={styles.toolContainer}>
      <Text style={styles.info}>Introdu 2 valori pentru a o calcula pe a treia.</Text>
      <TextInput style={styles.input} placeholder="Tensiune (V)" keyboardType="numeric" value={v} onChangeText={setV} />
      <TextInput style={styles.input} placeholder="Curent (I)" keyboardType="numeric" value={i} onChangeText={setI} />
      <TextInput style={styles.input} placeholder="Rezistență (R)" keyboardType="numeric" value={r} onChangeText={setR} />
      <TouchableOpacity style={styles.calcButton} onPress={calculate}>
        <Text style={styles.calcButtonText}>Calculează</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.clearButton} onPress={() => { setV(''); setI(''); setR(''); }}>
        <Text style={styles.clearButtonText}>Resetează</Text>
      </TouchableOpacity>
    </View>
  );
};

const CapacitorCalculator = () => {
  const [r, setR] = useState('');
  const [c, setC] = useState('');
  const [time, setTime] = useState<string | null>(null);

  const calculate = () => {
    const valR = parseFloat(r);
    const valC = parseFloat(c); // in uF
    if (!isNaN(valR) && !isNaN(valC)) {
      const tau = valR * (valC / 1000000);
      setTime((5 * tau).toFixed(4));
    }
  };

  return (
    <View style={styles.toolContainer}>
      <Text style={styles.label}>Rezistență (Ω):</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={r} onChangeText={setR} />
      <Text style={styles.label}>Capacitate (μF):</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={c} onChangeText={setC} />
      <TouchableOpacity style={styles.calcButton} onPress={calculate}>
        <Text style={styles.calcButtonText}>Calculează Timp</Text>
      </TouchableOpacity>
      {time && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Timp încărcare completă (5τ):</Text>
          <Text style={styles.resultValue}>{time} s</Text>
        </View>
      )}
    </View>
  );
};

const FrequencyConverter = () => {
  const [f, setF] = useState('');
  const [w, setW] = useState('');
  const C = 299792458;

  const toWavelength = () => {
    const valF = parseFloat(f); // Hz
    if (!isNaN(valF)) setW((C / valF).toFixed(4));
  };

  const toFrequency = () => {
    const valW = parseFloat(w); // m
    if (!isNaN(valW)) setF((C / valW).toFixed(0));
  };

  return (
    <View style={styles.toolContainer}>
      <Text style={styles.label}>Frecvență (Hz):</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={f} onChangeText={setF} />
      <TouchableOpacity style={styles.calcButton} onPress={toWavelength}>
        <Text style={styles.calcButtonText}>→ Lungime de undă</Text>
      </TouchableOpacity>
      <View style={{ height: 20 }} />
      <Text style={styles.label}>Lungime de undă (m):</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={w} onChangeText={setW} />
      <TouchableOpacity style={styles.calcButton} onPress={toFrequency}>
        <Text style={styles.calcButtonText}>→ Frecvență</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('Menu');

  const renderContent = () => {
    switch (screen) {
      case 'Resistor': return <ResistorCalculator />;
      case 'Ohm': return <OhmsLaw />;
      case 'Capacitor': return <CapacitorCalculator />;
      case 'Frequency': return <FrequencyConverter />;
      default:
        return (
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={() => setScreen('Resistor')}>
              <Text style={styles.menuIcon}>🎨</Text>
              <Text style={styles.menuText}>Resistor Colors</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setScreen('Ohm')}>
              <Text style={styles.menuIcon}>⚡</Text>
              <Text style={styles.menuText}>Ohm's Law</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setScreen('Capacitor')}>
              <Text style={styles.menuIcon}>🔋</Text>
              <Text style={styles.menuText}>Capacitor Time</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setScreen('Frequency')}>
              <Text style={styles.menuIcon}>📡</Text>
              <Text style={styles.menuText}>RF Converter</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  const getTitle = () => {
    switch (screen) {
      case 'Resistor': return 'Resistor Calculator';
      case 'Ohm': return "Ohm's Law";
      case 'Capacitor': return 'Capacitor Time';
      case 'Frequency': return 'RF Converter';
      default: return 'ToolsElectro';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title={getTitle()} onBack={screen !== 'Menu' ? () => setScreen('Menu') : undefined} />
      <View style={styles.content}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  header: { height: 60, backgroundColor: '#1a73e8', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 },
  backButton: { marginRight: 15 },
  backButtonText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, padding: 20 },
  menuContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  menuItem: { width: '47%', backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 20, alignItems: 'center', elevation: 3 },
  menuIcon: { fontSize: 40, marginBottom: 10 },
  menuText: { fontSize: 16, fontWeight: '600', color: '#333', textAlign: 'center' },
  toolContainer: { flex: 1 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 5, color: '#555' },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  calcButton: { backgroundColor: '#1a73e8', padding: 15, borderRadius: 10, alignItems: 'center' },
  calcButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  clearButton: { marginTop: 10, padding: 10, alignItems: 'center' },
  clearButtonText: { color: '#666' },
  resultBox: { marginTop: 20, padding: 20, backgroundColor: '#e8f0fe', borderRadius: 10, alignItems: 'center' },
  resultLabel: { fontSize: 14, color: '#1a73e8' },
  resultValue: { fontSize: 32, fontWeight: 'bold', color: '#1a73e8', textAlign: 'center', marginVertical: 15 },
  info: { marginBottom: 15, color: '#666', fontStyle: 'italic' },
  resistorVisual: { height: 40, backgroundColor: '#d2b48c', borderRadius: 20, flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 40, marginBottom: 20, alignSelf: 'center', width: 200 },
  band: { width: 10, height: '100%', marginHorizontal: 10 },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  colorSquare: { width: 30, height: 30, margin: 2, borderRadius: 5, borderColor: '#000' },
});