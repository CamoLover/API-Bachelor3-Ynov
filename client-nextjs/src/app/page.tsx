"use client";

import GlassDiv from "@/components/GlassDiv";
import AddModal from "@/components/AddModal";
import { useEffect, useState } from 'react';
import { create as createSacha, update as updateSacha, remove as removeSacha, getAll as getAllSacha } from '@/lib/sacha';
import { create as createSkill, update as updateSkill, remove as removeSkill, getAll as getAllSkills } from '@/lib/skills';
import { create as createHobby, update as updateHobby, remove as removeHobby, getAll as getAllHobbies } from '@/lib/hobbies';
import { create as createName, update as updatePersonName, remove as removePersonName, getAll as getAllNames } from '@/lib/name';

type Endpoint = 'sacha' | 'skills' | 'hobbies' | 'name' | 'health';

export default function Home() {
  const [activeEndpoint, setActiveEndpoint] = useState<Endpoint | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [healthRoot, setHealthRoot] = useState<any | null>(null); // objet complet
  const [healthData, setHealthData] = useState<any | null>(null); // racine data
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [healthCode, setHealthCode] = useState<number | null>(null);
  const fetchHealth = async () => {
    try {
      setHealthLoading(true);
      setHealthError(null);
      const res = await fetch('/api/health', { cache: 'no-store' });
      setHealthCode(res.status);
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        setHealthRoot(json);
        setHealthData(json?.data ?? null);
      } catch {
        setHealthRoot({ status: 'inconnu', message: 'Réponse non JSON', raw: text.slice(0, 500) });
        setHealthData(null);
      }
    } catch (e: any) {
      setHealthError(e?.message || 'Erreur de statut API');
    } finally {
      setHealthLoading(false);
    }
  };

  const endpoints: { id: Endpoint, label: string }[] = [
    { id: 'sacha', label: 'Appréciations' },
    { id: 'skills', label: 'Compétences' },
    { id: 'hobbies', label: 'Loisirs' },
    { id: 'name', label: 'Surnoms' },
    { id: 'health', label: 'Statut API' },
  ];

  const handleButtonClick = (endpoint: Endpoint) => {
    // Reset UI state when switching sections
    setIsModalOpen(false);
    setIsDetailOpen(false);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setSelectedItem(null);
    setError(null);
    setHealthRoot(null);
    setHealthData(null);
    setHealthError(null);
    setHealthLoading(false);
    setHealthCode(null);
    setActiveEndpoint(endpoint);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const refresh = async () => {
    if (!activeEndpoint || activeEndpoint === 'health') return;
    setLoading(true);
    setError(null);
    try {
      let res: any = null;
      if (activeEndpoint === 'sacha') res = await getAllSacha();
      if (activeEndpoint === 'skills') res = await getAllSkills();
      if (activeEndpoint === 'hobbies') res = await getAllHobbies();
      if (activeEndpoint === 'name') res = await getAllNames();
      const payload = (res && res.data) ? res.data : res;
      let list: any[] = [];
      if (payload) {
        if (Array.isArray(payload)) list = payload;
        else if (payload.posts && Array.isArray(payload.posts)) list = payload.posts;
        else if (payload.skills && Array.isArray(payload.skills)) list = payload.skills;
        else if (payload.hobbies && Array.isArray(payload.hobbies)) list = payload.hobbies;
        else if (payload.names && Array.isArray(payload.names)) list = payload.names;
        else if (payload.items && Array.isArray(payload.items)) list = payload.items;
        else if (payload.results && Array.isArray(payload.results)) list = payload.results;
      }
      setItems(list);
    } catch (e: any) {
      setError(e?.message || 'Erreur de chargement');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setItems([]);
    if (activeEndpoint && activeEndpoint !== 'health') {
      refresh();
    }
    if (activeEndpoint === 'health') {
      fetchHealth();
    }
  }, [activeEndpoint]);

  const titleForItem = (item: any) => {
    return item?.name ?? item?.author ?? item?.title ?? `#${item?.id ?? ''}`;
  };

  const openDetails = (item: any) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const openEdit = (item: any) => {
    setSelectedItem(item);
    setIsEditOpen(true);
  };

  const openDelete = (item: any) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (formData: any) => {
    if (!activeEndpoint) return;

    try {
      let requestBody = {} as any;

      // Préparation du corps de la requête selon l'endpoint
      switch (activeEndpoint) {
        case 'sacha':
          requestBody = {
            author: formData.author || 'Anonyme',
            text: formData.text || ''
          };
          break;
        case 'skills':
          requestBody = {
            name: formData.name || '',
            level: formData.level || 'Beginner',
            category: formData.category || 'Autre'
          };
          break;
        case 'hobbies':
          requestBody = {
            name: formData.name || '',
            description: formData.description || '',
            level: formData.level || 'Débutant',
            since: formData.since || new Date().getFullYear().toString()
          };
          break;
        case 'name':
          requestBody = {
            name: formData.name || ''
          };
          break;
      }

      console.log('Soumission via lib pour:', activeEndpoint);
      console.log('Données envoyées:', requestBody);
      let data: any = null;
      if (activeEndpoint === 'sacha') {
        data = await createSacha(requestBody);
      } else if (activeEndpoint === 'skills') {
        data = await createSkill(requestBody);
      } else if (activeEndpoint === 'hobbies') {
        data = await createHobby(requestBody);
      } else if (activeEndpoint === 'name') {
        data = await createName(requestBody);
      }
      console.log('Réponse du serveur (lib):', data);
      setIsModalOpen(false);
      refresh();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      // Afficher un message d'erreur à l'utilisateur
      alert(`Erreur: ${error instanceof Error ? error.message : 'Une erreur est survenue'}`);
    }
  };

  const handleUpdateSubmit = async (formData: any) => {
    if (!activeEndpoint || !selectedItem) return;
    try {
      let body: any = {};
      if (activeEndpoint === 'sacha') {
        body = { author: formData.author ?? selectedItem.author, text: formData.text ?? selectedItem.text };
        await updateSacha(selectedItem.id, body);
      } else if (activeEndpoint === 'skills') {
        body = { name: formData.name ?? selectedItem.name, level: formData.level ?? selectedItem.level, category: formData.category ?? selectedItem.category };
        await updateSkill(selectedItem.id, body);
      } else if (activeEndpoint === 'hobbies') {
        body = { name: formData.name ?? selectedItem.name, description: formData.description ?? selectedItem.description, level: formData.level ?? selectedItem.level, since: formData.since ?? selectedItem.since };
        await updateHobby(selectedItem.id, body);
      } else if (activeEndpoint === 'name') {
        body = { name: formData.name ?? selectedItem.name };
        await updatePersonName(selectedItem.id, body);
      }
      setIsEditOpen(false);
      setSelectedItem(null);
      refresh();
    } catch (error) {
      alert(`Erreur: ${error instanceof Error ? error.message : 'Une erreur est survenue'}`);
    }
  };

  const handleConfirmDelete = async () => {
    if (!activeEndpoint || !selectedItem) return;
    try {
      if (activeEndpoint === 'sacha') await removeSacha(selectedItem.id);
      else if (activeEndpoint === 'skills') await removeSkill(selectedItem.id);
      else if (activeEndpoint === 'hobbies') await removeHobby(selectedItem.id);
      else if (activeEndpoint === 'name') await removePersonName(selectedItem.id);
      setIsDeleteOpen(false);
      setSelectedItem(null);
      refresh();
    } catch (error) {
      alert(`Erreur: ${error instanceof Error ? error.message : 'Une erreur est survenue'}`);
    }
  };
  return (
    <div className="min-h-screen">
      <div className="min-h-screen">
        <div className="container mx-auto px-4 h-full">
          <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-4rem)] py-4">
            {/* Colonne de gauche - 2/5 de largeur */}
            <div className="w-full md:w-2/5 h-auto md:h-full">
              <GlassDiv className="h-auto md:h-full flex flex-col">
                <h2 className="text-xl font-semibold mb-2 text-center">Voici Sacha</h2>
                <p className="text-center text-gray-200/90">Par SachAPI</p>
                <div className="flex justify-center mb-4 sm:mb-6">
                  <img
                    src="/sacha-body.png"
                    alt="Sacha"
                    className="w-full max-w-[200px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] h-auto object-contain"
                  />
                </div>
                <div className="px-2 flex-1">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 gap-2 sm:gap-3 md:gap-3 overflow-visible md:overflow-y-auto">
                    {endpoints.map((endpoint) => (
                      <button
                        key={endpoint.id}
                        onClick={() => handleButtonClick(endpoint.id)}
                        className={`w-full px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base transition-all duration-200 ${activeEndpoint === endpoint.id
                          ? 'bg-purple-700/80 text-white shadow-lg shadow-purple-500/30 border border-purple-400/30'
                          : 'bg-gray-800/40 hover:bg-gray-700/60 text-gray-200 hover:text-white border border-gray-600/30 hover:border-purple-500/50'
                          }`}
                      >
                        {endpoint.label}
                      </button>
                    ))}
                  </div>
                </div>
              </GlassDiv>
            </div>

            {/* Colonne de droite - 3/5 de largeur */}
            <div className="w-full md:w-3/5 h-full">
              <GlassDiv className="h-full flex flex-col">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center">
                  {activeEndpoint
                    ? endpoints.find(e => e.id === activeEndpoint)?.label || 'Détails'
                    : 'Sélectionnez une option'}
                </h2>
                <div className="p-3 sm:p-4 bg-gray-900/30 rounded-lg h-[calc(100%-4rem)] border border-purple-500/20 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div />
                    <div className="flex gap-2">
                      {activeEndpoint && activeEndpoint !== 'health' && (
                        <button onClick={refresh} className="px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600/40">Rafraîchir</button>
                      )}
                      {activeEndpoint && activeEndpoint !== 'health' && (
                        <button
                          onClick={handleAddClick}
                          className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg transition-all duration-200 bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30 border border-purple-400/30 hover:shadow-purple-500/50"
                        >
                          Ajouter
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex-grow overflow-auto">
                    {!activeEndpoint && (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-sm sm:text-base text-center text-gray-300/70 px-2">Sélectionnez une option dans le menu de gauche</p>
                      </div>
                    )}
                    {activeEndpoint && activeEndpoint !== 'health' && (
                      <div className="space-y-2">
                        {loading && <p className="text-gray-300">Chargement...</p>}
                        {error && <p className="text-red-400">{error}</p>}
                        {!loading && !error && items.length === 0 && (
                          <p className="text-gray-400">Aucun élément.</p>
                        )}
                        {!loading && !error && items.map((item) => (
                          <div
                            key={item.id ?? JSON.stringify(item)}
                            className="flex items-center justify-between bg-gray-800/40 border border-gray-700/40 rounded-md px-3 py-2 cursor-pointer hover:bg-gray-700/40 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                            role="button"
                            tabIndex={0}
                            onClick={() => openDetails(item)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                openDetails(item);
                              }
                            }}
                          >
                            <div className="text-left text-gray-200 hover:text-white truncate pr-3">
                              {titleForItem(item)}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); openEdit(item); }}
                                title="Modifier"
                                className="text-yellow-400 hover:text-yellow-300"
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5h2m-9 7h6m4 0h6M5 19h14M7 12l10-10 4 4-10 10H7v-4z" /></svg>
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); openDelete(item); }}
                                title="Supprimer"
                                className="text-red-400 hover:text-red-300"
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a2 2 0 012-2h4a2 2 0 012 2m-8 0H5m11 0h3" /></svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {activeEndpoint === 'health' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${healthCode && healthCode < 400 ? 'bg-green-500/15 text-green-300 border-green-400/30' : 'bg-red-500/15 text-red-300 border-red-400/30'}`}>
                              <span className={`w-2 h-2 rounded-full mr-2 ${healthCode && healthCode < 400 ? 'bg-green-400' : 'bg-red-400'}`} />
                              {healthCode && healthCode < 400 ? 'En ligne' : 'Hors ligne'}
                            </span>
                            <span className="text-sm text-gray-400">Code HTTP: <span className="text-gray-200 font-medium">{healthCode ?? '—'}</span></span>
                          </div>
                          <button onClick={fetchHealth} className="px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600/40 disabled:opacity-60" disabled={healthLoading}>
                            {healthLoading ? '...' : 'Rafraîchir'}
                          </button>
                        </div>
                        {healthError && <p className="text-red-400">{healthError}</p>}
                        {!healthError && (
                          <>
                            {/* Résumé */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                              <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3">
                                <div className="text-xs text-gray-400">Statut</div>
                                <div className="text-sm text-gray-200 mt-1">{(healthRoot?.status ?? 'inconnu').toString()}</div>
                              </div>
                              <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3">
                                <div className="text-xs text-gray-400">Code</div>
                                <div className="text-sm text-gray-200 mt-1">{healthRoot?.code ?? healthCode ?? '—'}</div>
                              </div>
                              <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3">
                                <div className="text-xs text-gray-400">Message</div>
                                <div className="text-sm text-gray-200 mt-1 truncate" title={healthRoot?.message ?? '—'}>{healthRoot?.message ?? '—'}</div>
                              </div>
                              <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3">
                                <div className="text-xs text-gray-400">Horodatage</div>
                                <div className="text-sm text-gray-200 mt-1">{healthRoot?.timestamp ?? '—'}</div>
                              </div>
                            </div>
                            {/* Sections détaillées */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                              {/* Serveur API */}
                              <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3">
                                <div className="text-sm text-gray-300 font-medium mb-2">Serveur API</div>
                                <div className="space-y-2">
                                  {([
                                    ['status', 'Statut'],
                                    ['temps_reponse', 'Temps de réponse'],
                                    ['memoire_utilisee', 'Mémoire utilisée'],
                                    ['pic_memoire', 'Pic mémoire'],
                                    ['version_php', 'Version PHP'],
                                  ] as const).map(([k, label]) => (
                                    <div key={k} className="flex items-center justify-between text-sm">
                                      <span className="text-gray-400">{label}</span>
                                      <span className="text-gray-200">{healthData?.serveur_api?.[k] ?? '—'}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              {/* Base de données */}
                              <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3">
                                <div className="text-sm text-gray-300 font-medium mb-2">Base de données</div>
                                <div className="space-y-2">
                                  {([
                                    ['status', 'Statut'],
                                    ['temps_reponse', 'Temps de réponse'],
                                  ] as const).map(([k, label]) => (
                                    <div key={k} className="flex items-center justify-between text-sm">
                                      <span className="text-gray-400">{label}</span>
                                      <span className="text-gray-200">{healthData?.base_de_donnees?.[k] ?? '—'}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              {/* Système */}
                              <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3">
                                <div className="text-sm text-gray-300 font-medium mb-2">Système</div>
                                <div className="space-y-2">
                                  {([
                                    ['timestamp', 'Horodatage'],
                                    ['timezone', 'Fuseau horaire'],
                                    ['uptime', 'Uptime'],
                                  ] as const).map(([k, label]) => (
                                    <div key={k} className="flex items-center justify-between text-sm">
                                      <span className="text-gray-400">{label}</span>
                                      <span className="text-gray-200">{healthData?.systeme?.[k] ?? '—'}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </GlassDiv>

              {/* Modal d'ajout */}
              {activeEndpoint && activeEndpoint !== 'health' && (
                <AddModal
                  isOpen={isModalOpen}
                  onClose={handleCloseModal}
                  endpoint={endpoints.find(e => e.id === activeEndpoint)?.label || ''}
                  endpointType={activeEndpoint as 'sacha' | 'skills' | 'hobbies' | 'name'}
                >
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleSubmit(Object.fromEntries(formData.entries()));
                  }}>
                    <div className="space-y-4">
                      {activeEndpoint === 'sacha' ? (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Votre nom
                            </label>
                            <input
                              type="text"
                              name="author"
                              placeholder="Votre nom ou pseudo"
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Votre message
                            </label>
                            <textarea
                              name="text"
                              rows={3}
                              placeholder="Votre avis sur Sacha..."
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            />
                          </div>
                        </>
                      ) : activeEndpoint === 'skills' ? (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Nom de la compétence
                            </label>
                            <input
                              type="text"
                              name="name"
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Niveau
                            </label>
                            <select
                              name="level"
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            >
                              {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
                                <option key={level} value={level}>
                                  {level}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Catégorie
                            </label>
                            <select
                              name="category"
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            >
                              {['Backend', 'Frontend', 'Database', 'DevOps', 'Mobile', 'Autre'].map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
                          </div>
                        </>
                      ) : activeEndpoint === 'hobbies' ? (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Nom du loisir
                            </label>
                            <input
                              type="text"
                              name="name"
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Description
                            </label>
                            <textarea
                              name="description"
                              rows={3}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Niveau
                            </label>
                            <input
                              type="text"
                              name="level"
                              placeholder="Ex: Débutant, Intermédiaire, Avancé"
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Depuis (année)
                            </label>
                            <input
                              type="number"
                              name="since"
                              min="1900"
                              max={new Date().getFullYear()}
                              defaultValue={new Date().getFullYear()}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Nouveau surnom
                          </label>
                          <input
                            type="text"
                            name="name"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                          />
                        </div>
                      )}

                      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors"
                        >
                          Enregistrer
                        </button>
                      </div>
                    </div>
                  </form>
                </AddModal>
              )}

              {/* Modal de détails */}
              {isDetailOpen && selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsDetailOpen(false)} />
                  <div className="relative z-10 w-full max-w-lg p-6 rounded-2xl bg-gray-800 border border-purple-500/30 shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-white">Détails</h3>
                      <button onClick={() => setIsDetailOpen(false)} className="text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <div className="space-y-4 max-h-[60vh] overflow-auto">
                      {activeEndpoint === 'sacha' && (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3">
                              <div className="text-xs text-gray-400">Auteur</div>
                              <div className="text-sm text-gray-200 mt-1">{selectedItem.author ?? '—'}</div>
                            </div>
                            <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3">
                              <div className="text-xs text-gray-400">ID</div>
                              <div className="text-sm text-gray-200 mt-1">{selectedItem.id ?? '—'}</div>
                            </div>
                            <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3">
                              <div className="text-xs text-gray-400">Créé le</div>
                              <div className="text-sm text-gray-200 mt-1">{selectedItem.created_at ?? '—'}</div>
                            </div>
                            <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3">
                              <div className="text-xs text-gray-400">Mis à jour le</div>
                              <div className="text-sm text-gray-200 mt-1">{selectedItem.updated_at ?? '—'}</div>
                            </div>
                          </div>
                          <div className="bg-gray-900/40 border border-gray-700/40 rounded-md p-3">
                            <div className="text-xs text-gray-400 mb-1">Message</div>
                            <div className="text-sm text-gray-100 whitespace-pre-wrap">{selectedItem.text ?? '—'}</div>
                          </div>
                        </>
                      )}

                      {activeEndpoint === 'skills' && (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3">
                              <div className="text-xs text-gray-400">Nom</div>
                              <div className="text-sm text-gray-200 mt-1">{selectedItem.name ?? '—'}</div>
                            </div>
                            <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3">
                              <div className="text-xs text-gray-400">Niveau</div>
                              <div className="text-sm mt-1">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                                  selectedItem.level === 'Expert' ? 'bg-purple-500/15 text-purple-300 border-purple-400/30' :
                                  selectedItem.level === 'Advanced' ? 'bg-blue-500/15 text-blue-300 border-blue-400/30' :
                                  selectedItem.level === 'Intermediate' ? 'bg-green-500/15 text-green-300 border-green-400/30' :
                                  'bg-gray-500/15 text-gray-300 border-gray-400/30'
                                }`}>{selectedItem.level ?? '—'}</span>
                              </div>
                            </div>
                            <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3 sm:col-span-2">
                              <div className="text-xs text-gray-400">Catégorie</div>
                              <div className="text-sm text-gray-200 mt-1">{selectedItem.category ?? '—'}</div>
                            </div>
                            <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3">
                              <div className="text-xs text-gray-400">Créé le</div>
                              <div className="text-sm text-gray-200 mt-1">{selectedItem.created_at ?? '—'}</div>
                            </div>
                            <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3">
                              <div className="text-xs text-gray-400">Mis à jour le</div>
                              <div className="text-sm text-gray-200 mt-1">{selectedItem.updated_at ?? '—'}</div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeEndpoint === 'hobbies' && (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3">
                              <div className="text-xs text-gray-400">Nom</div>
                              <div className="text-sm text-gray-200 mt-1">{selectedItem.name ?? '—'}</div>
                            </div>
                            <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3">
                              <div className="text-xs text-gray-400">Niveau</div>
                              <div className="text-sm text-gray-200 mt-1">{selectedItem.level ?? '—'}</div>
                            </div>
                            <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3">
                              <div className="text-xs text-gray-400">Depuis</div>
                              <div className="text-sm text-gray-200 mt-1">{selectedItem.since ?? '—'}</div>
                            </div>
                            <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3">
                              <div className="text-xs text-gray-400">ID</div>
                              <div className="text-sm text-gray-200 mt-1">{selectedItem.id ?? '—'}</div>
                            </div>
                            <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3">
                              <div className="text-xs text-gray-400">Créé le</div>
                              <div className="text-sm text-gray-200 mt-1">{selectedItem.created_at ?? '—'}</div>
                            </div>
                            <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3">
                              <div className="text-xs text-gray-400">Mis à jour le</div>
                              <div className="text-sm text-gray-200 mt-1">{selectedItem.updated_at ?? '—'}</div>
                            </div>
                          </div>
                          <div className="bg-gray-900/40 border border-gray-700/40 rounded-md p-3">
                            <div className="text-xs text-gray-400 mb-1">Description</div>
                            <div className="text-sm text-gray-100 whitespace-pre-wrap">{selectedItem.description ?? '—'}</div>
                          </div>
                        </>
                      )}

                      {activeEndpoint === 'name' && (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3 sm:col-span-2">
                              <div className="text-xs text-gray-400">Surnom</div>
                              <div className="text-sm text-gray-200 mt-1">{selectedItem.name ?? '—'}</div>
                            </div>
                            <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3">
                              <div className="text-xs text-gray-400">ID</div>
                              <div className="text-sm text-gray-200 mt-1">{selectedItem.id ?? '—'}</div>
                            </div>
                            <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3">
                              <div className="text-xs text-gray-400">Créé le</div>
                              <div className="text-sm text-gray-200 mt-1">{selectedItem.created_at ?? '—'}</div>
                            </div>
                            <div className="bg-gray-800/40 border border-gray-700/40 rounded-md p-3">
                              <div className="text-xs text-gray-400">Mis à jour le</div>
                              <div className="text-sm text-gray-200 mt-1">{selectedItem.updated_at ?? '—'}</div>
                            </div>
                          </div>
                        </>
                      )}

                      {!activeEndpoint && (
                        <pre className="text-gray-200 text-sm whitespace-pre-wrap break-words bg-gray-900/40 p-3 rounded-md">{JSON.stringify(selectedItem, null, 2)}</pre>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal d'édition */}
              {isEditOpen && selectedItem && activeEndpoint && activeEndpoint !== 'health' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsEditOpen(false)} />
                  <div className="relative z-10 w-full max-w-md p-6 rounded-2xl bg-gray-800 border border-purple-500/30 shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-white">Modifier</h3>
                      <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      handleUpdateSubmit(Object.fromEntries(formData.entries()));
                    }}>
                      <div className="space-y-4">
                        {activeEndpoint === 'sacha' ? (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">Auteur</label>
                              <input defaultValue={selectedItem.author} name="author" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">Texte</label>
                              <textarea defaultValue={selectedItem.text} name="text" rows={3} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            </div>
                          </>
                        ) : activeEndpoint === 'skills' ? (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">Nom</label>
                              <input defaultValue={selectedItem.name} name="name" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">Niveau</label>
                              <select name="level" defaultValue={selectedItem.level} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                                {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
                                  <option key={level} value={level}>{level}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">Catégorie</label>
                              <select name="category" defaultValue={selectedItem.category} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                                {['Backend', 'Frontend', 'Database', 'DevOps', 'Mobile', 'Autre'].map((category) => (
                                  <option key={category} value={category}>{category}</option>
                                ))}
                              </select>
                            </div>
                          </>
                        ) : activeEndpoint === 'hobbies' ? (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">Nom</label>
                              <input defaultValue={selectedItem.name} name="name" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                              <textarea defaultValue={selectedItem.description} name="description" rows={3} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">Niveau</label>
                              <input defaultValue={selectedItem.level} name="level" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">Depuis</label>
                              <input type="number" defaultValue={selectedItem.since} name="since" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">Nom</label>
                              <input defaultValue={selectedItem.name} name="name" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            </div>
                          </>
                        )}

                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                          <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors">Annuler</button>
                          <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors">Enregistrer</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Confirmation suppression */}
              {isDeleteOpen && selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsDeleteOpen(false)} />
                  <div className="relative z-10 w-full max-w-sm p-6 rounded-2xl bg-gray-800 border border-purple-500/30 shadow-xl">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-white">Confirmer la suppression</h3>
                      <p className="text-gray-300 mt-2">Voulez-vous supprimer "{titleForItem(selectedItem)}" ?</p>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors">Annuler</button>
                      <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors">Supprimer</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

