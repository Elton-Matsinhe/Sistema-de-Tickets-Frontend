import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contextos/AuthContext.jsx';
import fallbackWordmark from '../assets/logo-imperial.svg';

/** Logótipo referenciado no site oficial [imperialinsurance-mz.com](https://www.imperialinsurance-mz.com/) (asset no imgur ligado na página). */
const LOGO_OFICIAL =
  '';

const BRAND = '#106a37';
const BRAND_DARK = '#0a4d28';

const SITE_OFICIAL = 'https://www.imperialinsurance-mz.com/';

function LogoMarca() {
  const [etapa, setEtapa] = useState(0);

  const onErro = useCallback(() => {
    setEtapa((e) => e + 1);
  }, []);

  if (etapa === 0) {
    return (
      <a
        href={SITE_OFICIAL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40 rounded"
      >
        <img
          src={LOGO_OFICIAL}
          alt="Imperial Insurance Moçambique"
          className="mx-auto h-[52px] w-auto max-h-[72px] max-w-[min(100%,320px)] object-contain object-center"
          onError={onErro}
          referrerPolicy="no-referrer"
        />
      </a>
    );
  }
  if (etapa === 1) {
    return (
      <a href={SITE_OFICIAL} target="_blank" rel="noopener noreferrer">
        <img
          src="/imperial-logo.png"
          alt="Imperial Insurance Moçambique"
          className="mx-auto h-[52px] w-auto max-w-[280px] object-contain"
          onError={onErro}
        />
      </a>
    );
  }
  return (
    <a
      href={SITE_OFICIAL}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <img
        src={fallbackWordmark}
        alt="Imperial Seguros"
        className="mx-auto h-12 w-auto max-w-[280px] object-contain opacity-90"
      />
    </a>
  );
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setErro('');
    if (!email.trim() || !senha) {
      setErro('Preencha email e senha.');
      return;
    }
    setCarregando(true);
    try {
      await login(email.trim(), senha);
      navigate('/', { replace: true });
    } catch (err) {
      setErro(err.message || 'Falha no login');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100">
      {/* Fundo suave — sem textura pesada */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(1200px 600px at 50% -10%, rgba(16,106,55,0.08), transparent 55%), radial-gradient(900px 500px at 100% 100%, rgba(16,106,55,0.05), transparent 50%), linear-gradient(180deg, #ffffff 0%, #f1f5f9 55%, #e8eef3 100%)',
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0a4d28] via-[#106a37] to-[#1a8c4a]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-sm sm:p-10">
          <div className="mb-8 text-center">
            <LogoMarca />
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              Portal interno
            </p>
            <h1 className="mt-1 text-lg font-semibold text-slate-800">
              Sistema de gestão de tickets
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Acesso reservado a contas autorizadas da{' '}
              <a
                href={SITE_OFICIAL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#106a37] underline-offset-2 hover:underline"
              >
                Imperial Insurance Moçambique
              </a>
              .
            </p>
          </div>

          <form onSubmit={enviar} className="space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-xs font-semibold text-slate-600"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#106a37] focus:ring-2 focus:ring-[#106a37]/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                placeholder="nome@empresa.co.mz"
              />
            </div>
            <div>
              <label
                htmlFor="login-senha"
                className="mb-1.5 block text-xs font-semibold text-slate-600"
              >
                Senha
              </label>
              <input
                id="login-senha"
                type="password"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-[#106a37] focus:ring-2 focus:ring-[#106a37]/20"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>
            {erro && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {erro}
              </div>
            )}
            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-xl py-3.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                background: `linear-gradient(180deg, ${BRAND} 0%, ${BRAND_DARK} 100%)`,
              }}
            >
              {carregando ? 'A entrar…' : 'Entrar'}
            </button>
          </form>

          <p className="mt-8 border-t border-slate-100 pt-6 text-center text-[11px] leading-relaxed text-slate-500">
            Teste: <span className="text-slate-700">admin@empresa.co.mz</span> ou{' '}
            <span className="text-slate-700">tecnico1@empresa.co.mz</span>
            <span className="mx-1">·</span>
            <span className="font-mono text-slate-600">Senha@123</span>
          </p>
        </div>

        <footer className="mt-8 text-center text-[11px] text-slate-500">
          <p className="font-medium text-slate-600">
            Imperial Insurance Moçambique, S.A.
          </p>
          <p className="mt-1">
            Av. Kenneth Kaunda, n.º 806 (Sede) · Maputo — conforme{' '}
            <a
              href={SITE_OFICIAL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#106a37] underline-offset-2 hover:underline"
            >
              imperialinsurance-mz.com
            </a>
          </p>
          <p className="mt-0.5">
            +258 21610110 · info@imperialinsurance-mz.com
          </p>
        </footer>
      </div>
    </div>
  );
}
