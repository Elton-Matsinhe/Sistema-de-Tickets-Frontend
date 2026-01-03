import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiBarChart2,
  FiHelpCircle,
  FiX,
  FiMenu,
  FiChevronLeft,
  FiChevronRight,
  FiShield,
  FiBell,
  FiUser
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.png';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  const menuItems = [
    { to: '/', icon: FiHome, label: 'Dashboard', info: 'Visão geral do sistema' },
    { to: '/listar', icon: FiUsers, label: 'Listar Tickets', info: 'Gestão de Tickets' },
    { to: '/relatorios', icon: FiBarChart2, label: 'Relatórios', info: 'Relatórios de Tickets' },
    { to: '/ajuda', icon: FiHelpCircle, label: 'Ajuda', info: 'Suporte e documentação' },
  ];

  // Sistema de partículas 3D melhorado
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Criar partículas
    const createParticles = () => {
      const particles = [];
      const particleCount = 15;
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          color: `rgba(${16}, ${106}, ${55}, ${Math.random() * 0.1 + 0.05})`
        });
      }
      return particles;
    };

    particlesRef.current = createParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Desenhar partículas
      particlesRef.current.forEach((particle, index) => {
        // Atualizar posição
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Rebater nas bordas
        if (particle.x <= 0 || particle.x >= canvas.width) particle.speedX *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.speedY *= -1;
        
        // Desenhar partícula
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Desenhar conexões
        for (let j = index + 1; j < particlesRef.current.length; j++) {
          const dx = particle.x - particlesRef.current[j].x;
          const dy = particle.y - particlesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 60) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(16, 106, 55, ${0.1 * (1 - distance / 60)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.stroke();
          }
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Redimensionar canvas quando a janela for redimensionada
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particlesRef.current = createParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay com efeito de blur */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 260 : 80,
          x: isOpen || window.innerWidth >= 1024 ? 0 : -260
        }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 25
        }}
        className="fixed top-0 left-0 h-full z-50 overflow-hidden"
        style={{
          boxShadow: '10px 0 30px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Efeito de vidro fumê */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.97) 0%, rgba(255, 255, 255, 0.99) 100%)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        />
        
        {/* Fundo animado com partículas */}
        <div className="absolute inset-0 overflow-hidden">
          <canvas
            ref={canvasRef}
            className="absolute inset-0"
            style={{ 
              opacity: isOpen ? 1 : 0,
              transition: 'opacity 0.5s ease'
            }}
          />
          
          {/* Gradientes decorativos */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 20% 80%, rgba(16, 106, 55, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(13, 90, 44, 0.03) 0%, transparent 50%)
              `
            }}
          />
        </div>

        <div className="relative flex flex-col h-full">
          {/* Header do Sidebar */}
          <motion.div 
            className={`flex items-center backdrop-blur-sm bg-white/80 ${isOpen ? 'px-5 py-6' : 'justify-center py-6'}`}
            style={{
              borderBottom: '1px solid rgba(16, 106, 55, 0.1)'
            }}
          >
            {isOpen ? (
              <>
                <motion.div 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <img 
                      src={logo} 
                      alt="Imperial Insurance" 
                      className="w-10 h-10 object-contain"
                    />
                    <motion.div 
                      className="absolute -inset-2 bg-gradient-to-r from-[#106a37]/20 to-[#0d5a2c]/20 rounded-full blur-sm"
                      animate={{ 
                        opacity: [0.3, 0.5, 0.3],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 3,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                  <div className="overflow-hidden">
                    <h2 className="font-bold text-base bg-gradient-to-r from-[#106a37] to-[#0d5a2c] bg-clip-text text-transparent">
                      Imperial S.A
                    </h2>
                    <p className="text-xs text-gray-500">Gestão de Tickets</p>
                  </div>
                </motion.div>
                <div className="flex gap-1 ml-auto">
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(16, 106, 55, 0.1)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleSidebar}
                    className="hidden lg:flex p-2 rounded-lg transition-all"
                    title="Ocultar Menu"
                  >
                    <FiChevronLeft className="w-4 h-4 text-[#106a37]" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(16, 106, 55, 0.1)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 rounded-lg transition-all"
                    title="Fechar Menu"
                  >
                    <FiX className="w-4 h-4 text-[#106a37]" />
                  </motion.button>
                </div>
              </>
            ) : (
              <div className="relative">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <img 
                    src={logo} 
                    alt="Logo" 
                    className="w-8 h-8 object-contain"
                  />
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleSidebar}
                  className="absolute -right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center w-6 h-6 bg-white rounded-full border border-gray-200 shadow-lg hover:shadow-xl transition-all"
                  title="Mostrar Menu"
                >
                  <FiChevronRight className="w-3 h-3 text-[#106a37]" />
                </motion.button>
              </div>
            )}
          </motion.div>

          {/* Menu Items - Com maior espaçamento */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-3"> {/* Aumentado de space-y-1 para space-y-3 */}
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                
                return (
                  <motion.li 
                    key={item.to}
                    initial={false}
                    animate={{ 
                      x: isOpen ? 0 : -10,
                      opacity: isOpen ? 1 : 0.8
                    }}
                    transition={{ 
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 300
                    }}
                  >
                    <Link
                      to={item.to}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          toggleSidebar();
                        }
                      }}
                      className={`relative flex items-center gap-3 rounded-xl transition-all group p-3 ${
                        isActive
                          ? 'bg-gradient-to-r from-[#106a37] to-[#0d5a2c] text-white shadow-lg shadow-[#106a37]/30'
                          : 'text-gray-700 hover:bg-white/80 hover:shadow-md'
                      }`}
                      style={{
                        backdropFilter: 'blur(5px)'
                      }}
                    >
                      {/* Indicador de item ativo */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500 }}
                        />
                      )}
                      
                      {/* Ícone com efeito especial */}
                      <motion.div 
                        className={`relative p-2 rounded-lg ${
                          isActive 
                            ? 'bg-white/20' 
                            : 'bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-[#106a37]/10 group-hover:to-[#0d5a2c]/10'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-[#106a37]'}`} />
                      </motion.div>
                      
                      {isOpen && (
                        <motion.div 
                          className="flex-1 overflow-hidden"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 + 0.1 }}
                        >
                          <div className="font-medium text-sm">{item.label}</div>
                          <div className={`text-xs mt-0.5 ${isActive ? 'text-white/90' : 'text-gray-500'}`}>
                            {item.info}
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Efeito de brilho ao passar o mouse */}
                      {!isActive && (
                        <motion.div 
                          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 100%)',
                            mixBlendMode: 'overlay'
                          }}
                          whileHover={{
                            opacity: 0.2
                          }}
                        />
                      )}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile & Footer */}
          {isOpen && (
            <motion.div 
              className="p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div 
                className="bg-gradient-to-br from-white/90 to-gray-50/90 rounded-xl p-3 backdrop-blur-sm border border-white/50 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-3">
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-[#106a37] to-[#0d5a2c] rounded-full flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-white" />
                    </div>
                  </motion.div>
                  <div className="flex-1">
                    <p className="font-medium text-xs text-gray-800">Usuário Ativo</p>
                    <p className="text-xs text-gray-500">Sistema de Gestão</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1.5 rounded-lg hover:bg-white/50 transition-colors"
                    title="Notificações"
                  >
                    <FiBell className="w-3.5 h-3.5 text-gray-600" />
                  </motion.button>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-200/50">
                  <div className="flex items-center gap-1">
                    <FiShield className="w-3 h-3 text-[#106a37]" />
                    <span className="text-xs text-gray-600">Versão 1.0.0</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Imperial Insurance
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.aside>

      {/* Botão flutuante para abrir sidebar */}
      {(!isOpen || window.innerWidth < 1024) && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 10px 25px rgba(16, 106, 55, 0.3)'
          }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-30 lg:hidden p-3 bg-gradient-to-r from-[#106a37] to-[#0d5a2c] rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <FiMenu className="w-5 h-5 text-white" />
        </motion.button>
      )}
    </>
  );
};

export default Sidebar;