import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Animated,
  Easing,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { loginApi } from '../services/api.js';

const { width, height } = Dimensions.get('window');
const PRIMARY_COLOR = '#106a37';
const PRIMARY_LIGHT = '#2e8b57';
const PRIMARY_GLOW = 'rgba(16, 106, 55, 0.3)';
const SECONDARY_COLOR = '#1e8449';
const BACKGROUND = '#ffffff';
const TEXT_PRIMARY = '#1a1a1a';
const TEXT_SECONDARY = '#666666';
const TEXT_PLACEHOLDER = '#999999';
const INPUT_BORDER = '#e0e0e0';
const INPUT_BG = '#fafafa';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userListOpen, setUserListOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeField, setActiveField] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Animações principais
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(20)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const logoPulse = useRef(new Animated.Value(0)).current;
  
  // Efeitos de fundo
  const bgFloat = useRef(new Animated.Value(0)).current;
  const gradientPulse = useRef(new Animated.Value(0)).current;
  const patternRotation = useRef(new Animated.Value(0)).current;
  
  // Animações simplificadas para evitar erros
  const particlesOpacity = useRef(new Animated.Value(0.05)).current;
  const shapesOpacity = useRef(new Animated.Value(0.03)).current;
  const linesOpacity = useRef(new Animated.Value(0.02)).current;

  const users = useMemo(() => ['Administrador', 'Técnico'], []);

  // Animação de pulsação do gradiente
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(gradientPulse, {
          toValue: 1,
          duration: 6000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(gradientPulse, {
          toValue: 0,
          duration: 6000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Animação de rotação do padrão de fundo
  useEffect(() => {
    Animated.loop(
      Animated.timing(patternRotation, {
        toValue: 1,
        duration: 120000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Animação de flutuação do background
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgFloat, {
          toValue: 1,
          duration: 10000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bgFloat, {
          toValue: 0,
          duration: 10000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Animação de pulso das partículas
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(particlesOpacity, {
          toValue: 0.15,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(particlesOpacity, {
          toValue: 0.05,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Animação de pulso das formas
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shapesOpacity, {
          toValue: 0.08,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(shapesOpacity, {
          toValue: 0.03,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Animação de pulso das linhas
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(linesOpacity, {
          toValue: 0.05,
          duration: 5000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(linesOpacity, {
          toValue: 0.02,
          duration: 5000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Animação de pulso do logo
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoPulse, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(logoPulse, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Animação de entrada
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const userEmails = useMemo(
    () => ({
      Administrador: 'admin@empresa.co.mz',
      Técnico: 'tecnico1@empresa.co.mz',
    }),
    []
  );

  const handleSelectUser = (name) => {
    setSelectedUser(name);
    setEmail(userEmails[name] || '');
    setUserListOpen(false);
  };

  const handleLogin = async () => {
    if (isLoggingIn) return;
    if (!email.trim() || !password) {
      Alert.alert('Atenção', 'Informe email e senha.');
      return;
    }

    setIsLoggingIn(true);
    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      const data = await loginApi(email.trim(), password);
      if (onLogin) {
        onLogin({
          token: data.token,
          usuario: data.usuario,
        });
      }
    } catch (e) {
      Alert.alert('Login falhou', e.message || 'Credenciais inválidas');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Interpolações
  const logoScale = logoPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const bgFloatY = bgFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 15],
  });

  const gradientOpacity = gradientPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.02, 0.06],
  });

  const patternRotate = patternRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Função para gerar posições aleatórias estáticas
  const getRandomPosition = (max, count) => {
    return Array.from({ length: count }).map(() => ({
      left: Math.random() * max,
      top: Math.random() * height * 0.8,
    }));
  };

  // Posições estáticas para elementos de fundo
  const particlePositions = getRandomPosition(width, 25);
  const shapePositions = getRandomPosition(width, 12);
  const linePositions = getRandomPosition(width, 6);
  const patternPositions = getRandomPosition(width, 8);
  const bubblePositions = getRandomPosition(width, 5);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={BACKGROUND} />
      
      {/* Background com efeitos visuais simplificados */}
      <Animated.View 
        style={[
          styles.background,
          {
            transform: [{ translateY: bgFloatY }]
          }
        ]}
      >
        {/* Camada de gradiente sutil animado */}
        <Animated.View 
          style={[
            styles.gradientLayer,
            {
              opacity: gradientOpacity,
            }
          ]}
        />
        
        {/* Padrões geométricos de fundo */}
        <Animated.View 
          style={[
            styles.patternLayer,
            {
              transform: [{ rotate: patternRotate }]
            }
          ]}
        >
          {patternPositions.map((position, index) => (
            <View
              key={`pattern-${index}`}
              style={[
                styles.backgroundPattern,
                {
                  left: position.left,
                  top: position.top,
                },
              ]}
            />
          ))}
        </Animated.View>
        
        {/* Bolhas de gradiente */}
        {bubblePositions.map((position, index) => (
          <Animated.View
            key={`bubble-${index}`}
            style={[
              styles.gradientBubble,
              {
                left: position.left,
                top: position.top,
                opacity: particlesOpacity,
              },
            ]}
          />
        ))}
        
        {/* Formas geométricas */}
        {shapePositions.map((position, index) => {
          const shapeType = ['circle', 'square', 'triangle', 'hexagon'][index % 4];
          const ShapeComponent = shapeType === 'circle' ? styles.geometricCircle :
                               shapeType === 'square' ? styles.geometricSquare :
                               shapeType === 'triangle' ? styles.geometricTriangle :
                               styles.geometricHexagon;
          
          return (
            <Animated.View
              key={`shape-${index}`}
              style={[
                ShapeComponent,
                {
                  left: position.left,
                  top: position.top,
                  opacity: shapesOpacity,
                },
              ]}
            />
          );
        })}
        
        {/* Partículas */}
        {particlePositions.map((position, index) => (
          <Animated.View
            key={`particle-${index}`}
            style={[
              styles.particle,
              index % 2 === 0 ? styles.particleTiny : styles.particleSmall,
              {
                left: position.left,
                top: position.top,
                opacity: particlesOpacity,
              },
            ]}
          />
        ))}
      </Animated.View>

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header com logo animada */}
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeIn,
                transform: [{ translateY: slideUp }]
              }
            ]}
          >
            <Animated.View 
              style={[
                styles.logoContainer,
                {
                  transform: [{ scale: logoScale }]
                }
              ]}
            >
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              {/* Efeito de brilho sutil no logo */}
              <Animated.View 
                style={[
                  styles.logoGlow,
                  {
                    opacity: logoPulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.1, 0.2],
                    }),
                  }
                ]} 
              />
            </Animated.View>
            
            <Text style={styles.companyName}>Imperial Insurance</Text>
            
            {/* Separador decorativo com animação */}
            <Animated.View 
              style={[
                styles.separator,
                {
                  opacity: fadeIn,
                  transform: [
                    { scale: fadeIn },
                  ]
                }
              ]} 
            />
            
            <Text style={styles.title}>Gestão de Tickets</Text>
            <Text style={styles.subtitle}>Sistema Corporativo</Text>
          </Animated.View>

          {/* Formulário */}
          <Animated.View 
            style={[
              styles.formContainer,
              {
                opacity: formOpacity,
                transform: [{ translateY: slideUp }]
              }
            ]}
          >
            {/* Seleção de Utilizador */}
            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Ionicons 
                  name="people-circle-outline" 
                  size={15} 
                  color={TEXT_SECONDARY} 
                />
                <Text style={styles.label}>UTILIZADOR</Text>
              </View>
              <View style={styles.dropdownWrapper}>
                <Pressable
                  style={[
                    styles.input,
                    styles.dropdownInput,
                    activeField === 'user' && styles.inputFocused
                  ]}
                  onPress={() => {
                    setUserListOpen(!userListOpen);
                    setActiveField('user');
                  }}
                >
                  <Ionicons 
                    name="person-circle-outline" 
                    size={18} 
                    color={activeField === 'user' ? PRIMARY_COLOR : TEXT_SECONDARY} 
                  />
                  <Text style={[
                    styles.inputText,
                    !selectedUser && styles.placeholderText
                  ]}>
                    {selectedUser || 'Selecionar utilizador'}
                  </Text>
                  <Ionicons 
                    name={userListOpen ? 'chevron-up' : 'chevron-down'} 
                    size={18} 
                    color={TEXT_SECONDARY} 
                  />
                </Pressable>

                {userListOpen && (
                  <Animated.View 
                    style={[
                      styles.dropdownList,
                      {
                        opacity: fadeIn,
                        transform: [{ translateY: slideUp }]
                      }
                    ]}
                  >
                    {users.map((user) => (
                      <TouchableOpacity
                        key={user}
                        style={styles.dropdownItem}
                        onPress={() => handleSelectUser(user)}
                      >
                        <Ionicons 
                          name="person-outline" 
                          size={16} 
                          color={TEXT_SECONDARY} 
                        />
                        <Text style={styles.dropdownItemText}>{user}</Text>
                        {selectedUser === user && (
                          <Ionicons name="checkmark-circle" size={16} color={PRIMARY_COLOR} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </Animated.View>
                )}
              </View>
            </View>

            {/* Email Institucional */}
            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Ionicons 
                  name="at-circle-outline" 
                  size={15} 
                  color={TEXT_SECONDARY} 
                />
                <Text style={styles.label}>EMAIL INSTITUCIONAL</Text>
              </View>
              <Pressable
                style={[
                  styles.inputWrapper,
                  activeField === 'email' && styles.inputFocused
                ]}
                onPress={() => setActiveField('email')}
              >
                <Ionicons 
                  name="at-outline" 
                  size={18} 
                  color={activeField === 'email' ? PRIMARY_COLOR : TEXT_SECONDARY} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="exemplo@imperialinsurance-mz.com"
                  placeholderTextColor={TEXT_PLACEHOLDER}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setActiveField('email')}
                  onBlur={() => setActiveField(null)}
                  editable={true}
                />
                {email.length > 0 && (
                  <TouchableOpacity 
                    onPress={() => setEmail('')}
                    style={styles.clearButton}
                  >
                    <Ionicons name="close-circle" size={16} color={TEXT_SECONDARY} />
                  </TouchableOpacity>
                )}
              </Pressable>
            </View>

            {/* Senha */}
            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Ionicons 
                  name="finger-print-outline" 
                  size={15} 
                  color={TEXT_SECONDARY} 
                />
                <Text style={styles.label}>SENHA</Text>
              </View>
              <Pressable
                style={[
                  styles.inputWrapper,
                  activeField === 'password' && styles.inputFocused
                ]}
                onPress={() => setActiveField('password')}
              >
                <Ionicons 
                  name="key-outline" 
                  size={18} 
                  color={activeField === 'password' ? PRIMARY_COLOR : TEXT_SECONDARY} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={TEXT_PLACEHOLDER}
                  secureTextEntry={!showPassword}
                  autoCorrect={false}
                  onFocus={() => setActiveField('password')}
                  onBlur={() => setActiveField(null)}
                  editable={true}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons 
                    name={showPassword ? 'eye-off' : 'eye'} 
                    size={20} 
                    color={TEXT_SECONDARY} 
                  />
                </TouchableOpacity>
              </Pressable>
            </View>

            {/* Botão de Entrar com animação */}
            <Animated.View 
              style={[
                styles.loginButtonContainer,
                { transform: [{ scale: buttonScale }] }
              ]}
            >
              <TouchableOpacity
                onPress={handleLogin}
                activeOpacity={0.9}
                disabled={isLoggingIn}
                style={styles.loginButton}
              >
                {isLoggingIn ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#fff" />
                  </View>
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>ENTRAR</Text>
                    <Ionicons 
                      name="enter-outline" 
                      size={20} 
                      color="#fff" 
                    />
                  </>
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Links de Ajuda */}
            <Animated.View 
              style={[
                styles.helpContainer,
                {
                  opacity: formOpacity,
                }
              ]}
            >
              <TouchableOpacity style={styles.helpLink}>
                <Ionicons name="lock-open-outline" size={14} color={PRIMARY_COLOR} />
                <Text style={styles.helpText}>Recuperar senha</Text>
              </TouchableOpacity>
              
              <View style={styles.separatorSmall} />
              
              <TouchableOpacity style={styles.helpLink}>
                <Ionicons name="headset-outline" size={14} color={PRIMARY_COLOR} />
                <Text style={styles.helpText}>Suporte técnico</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gradientLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: PRIMARY_GLOW,
  },
  patternLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundPattern: {
    position: 'absolute',
    width: 150,
    height: 150,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(16, 106, 55, 0.05)',
    borderRadius: 10,
  },
  gradientBubble: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: PRIMARY_GLOW,
  },
  particle: {
    position: 'absolute',
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 50,
  },
  particleTiny: {
    width: 2,
    height: 2,
  },
  particleSmall: {
    width: 4,
    height: 4,
  },
  geometricCircle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(16, 106, 55, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(16, 106, 55, 0.1)',
  },
  geometricSquare: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: 'rgba(30, 132, 73, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(30, 132, 73, 0.1)',
  },
  geometricTriangle: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 30,
    borderRightWidth: 30,
    borderBottomWidth: 52,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(16, 106, 55, 0.05)',
  },
  geometricHexagon: {
    position: 'absolute',
    width: 60,
    height: 35,
    backgroundColor: 'rgba(30, 132, 73, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(30, 132, 73, 0.1)',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'center',
    minHeight: height,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
    position: 'relative',
  },
  logoContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  logo: {
    width: 80,
    height: 80,
    zIndex: 2,
  },
  logoGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: PRIMARY_GLOW,
    top: -10,
    left: -10,
    zIndex: 1,
  },
  companyName: {
    fontSize: 14,
    fontWeight: '500',
    color: TEXT_SECONDARY,
    letterSpacing: 2,
    marginBottom: 16,
  },
  separator: {
    width: 80,
    height: 2,
    backgroundColor: PRIMARY_COLOR,
    marginBottom: 20,
    borderRadius: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    fontWeight: '400',
    letterSpacing: 1,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  formGroup: {
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    marginLeft: 4,
  },
  label: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dropdownWrapper: {
    position: 'relative',
  },
  dropdownInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: INPUT_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    height: 52,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: TEXT_PRIMARY,
    fontWeight: '400',
    marginHorizontal: 12,
  },
  placeholderText: {
    color: TEXT_PLACEHOLDER,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: BACKGROUND,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    marginTop: 4,
    maxHeight: 200,
    overflow: 'hidden',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  dropdownItemText: {
    flex: 1,
    fontSize: 15,
    color: TEXT_PRIMARY,
    fontWeight: '400',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INPUT_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    paddingHorizontal: 16,
    height: 52,
  },
  inputFocused: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: '#f0f9f0',
    shadowColor: PRIMARY_COLOR,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: TEXT_PRIMARY,
    fontWeight: '400',
    paddingVertical: 0,
    height: '100%',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
  loginButtonContainer: {
    marginTop: 12,
    position: 'relative',
  },
  loginButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.5,
  },
  helpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 28,
  },
  helpLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  helpText: {
    fontSize: 14,
    color: PRIMARY_COLOR,
    fontWeight: '500',
  },
  separatorSmall: {
    width: 1,
    height: 16,
    backgroundColor: '#e0e0e0',
  },
});