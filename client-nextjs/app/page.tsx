"use client";

import GlassDiv from "./components/GlassDiv";
import AddModal from "./components/AddModal";
import Toast from "./components/Toast";
import { useState, useEffect } from 'react';

interface DataCardProps {
  item: DataItem;
  endpoint: Endpoint;
  onUpdate: (id: number) => void;
  onDelete: (id: number) => void;
}

function DataCard({ item, endpoint, onUpdate, onDelete }: DataCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
      return dateString;
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-500'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-4 hover:bg-gray-800/70 transition-all">
      {endpoint === 'health' ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 font-medium">{item.text}</span>
        </div>
      ) : endpoint === 'sacha' ? (
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-purple-300 font-medium">{item.author || 'Anonyme'}</span>
                {item.rating && <div className="flex">{renderStars(item.rating)}</div>}
              </div>
              <p className="text-gray-200 leading-relaxed">{item.text}</p>
            </div>
            {item.id && (
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => onUpdate(item.id!)}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                  title="Modifier"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(item.id!)}
                  className="text-red-400 hover:text-red-300 text-sm"
                  title="Supprimer"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
          {item.created_at && (
            <div className="text-xs text-gray-500 border-t border-gray-700 pt-2">
              Publié le {formatDate(item.created_at)}
            </div>
          )}
        </div>
      ) : endpoint === 'skills' ? (
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <div className="flex items-center space-x-3">
                <h3 className="text-white font-medium">{item.name}</h3>
                <span className="px-2 py-1 bg-purple-600/50 text-purple-200 rounded text-xs">
                  {item.level}
                </span>
                <span className="px-2 py-1 bg-gray-600/50 text-gray-200 rounded text-xs">
                  {item.category}
                </span>
              </div>
            </div>
            {item.id && (
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => onUpdate(item.id!)}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                  title="Modifier"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(item.id!)}
                  className="text-red-400 hover:text-red-300 text-sm"
                  title="Supprimer"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
          {item.created_at && (
            <div className="text-xs text-gray-500">
              Ajouté le {formatDate(item.created_at)}
            </div>
          )}
        </div>
      ) : endpoint === 'hobbies' ? (
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-white font-medium">{item.name}</h3>
                <span className="px-2 py-1 bg-purple-600/50 text-purple-200 rounded text-xs">
                  {item.level}
                </span>
                {item.since && (
                  <span className="text-gray-400 text-xs">Depuis {item.since}</span>
                )}
              </div>
              {item.description && (
                <p className="text-gray-300 text-sm">{item.description}</p>
              )}
            </div>
            {item.id && (
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => onUpdate(item.id!)}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                  title="Modifier"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(item.id!)}
                  className="text-red-400 hover:text-red-300 text-sm"
                  title="Supprimer"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
          {item.created_at && (
            <div className="text-xs text-gray-500">
              Ajouté le {formatDate(item.created_at)}
            </div>
          )}
        </div>
      ) : endpoint === 'name' ? (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-xl">👤</span>
              <span className="text-white font-medium text-lg">{item.name}</span>
            </div>
            {item.id && (
              <div className="flex space-x-2">
                <button
                  onClick={() => onUpdate(item.id!)}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                  title="Modifier"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(item.id!)}
                  className="text-red-400 hover:text-red-300 text-sm"
                  title="Supprimer"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
          {item.created_at && (
            <div className="text-xs text-gray-500">
              Ajouté le {formatDate(item.created_at)}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

type Endpoint = 'sacha' | 'skills' | 'hobbies' | 'name' | 'health';

type DataItem = {
  id?: number;
  name?: string;
  author?: string;
  text?: string;
  rating?: number;
  level?: string;
  category?: string;
  description?: string;
  since?: string;
  created_at?: string;
  updated_at?: string;
};

export default function Home() {
  const [activeEndpoint, setActiveEndpoint] = useState<Endpoint | null>(null);
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000';

  const endpoints: { id: Endpoint, label: string }[] = [
    { id: 'sacha', label: 'Appréciations' },
    { id: 'skills', label: 'Compétences' },
    { id: 'hobbies', label: 'Loisirs' },
    { id: 'name', label: 'Surnoms' },
    { id: 'health', label: 'Statut API' },
  ];

  const fetchData = async (endpoint: Endpoint) => {
    if (endpoint === 'health') {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${serverUrl}/health`);
        if (!response.ok) throw new Error('API indisponible');
        const result = await response.json();
        setData([{ text: result.message || 'API fonctionne correctement', name: 'Statut' }]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de connexion');
        setData([]);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${serverUrl}/${endpoint}`);
      if (!response.ok) throw new Error(`Erreur ${response.status}`);
      const result = await response.json();
      
      // Parse data based on endpoint structure
      let parsedData = [];
      if (result.data) {
        switch(endpoint) {
          case 'sacha':
            parsedData = result.data.posts || [];
            break;
          case 'skills':
            parsedData = result.data.skills || [];
            break;
          case 'hobbies':
            parsedData = result.data.hobbies || [];
            break;
          case 'name':
            parsedData = result.data.names || [];
            break;
          default:
            parsedData = Array.isArray(result.data) ? result.data : [result.data];
        }
      }
      
      console.log(`Data for ${endpoint}:`, parsedData);
      setData(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de récupération des données');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (endpoint: Endpoint) => {
    setActiveEndpoint(endpoint);
    fetchData(endpoint);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DataItem | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info', isVisible: boolean}>({
    message: '', type: 'info', isVisible: false
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleAddClick = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleUpdate = (id: number) => {
    const item = data.find(d => d.id === id);
    if (item) {
      setEditingItem(item);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (!activeEndpoint || activeEndpoint === 'health') return;
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

    try {
      setLoading(true);
      const response = await fetch(`${serverUrl}/${activeEndpoint}/delete/${id}`, {
        method: 'DELETE'
      });

      const responseData = await response.json();
      console.log('Delete response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Erreur lors de la suppression');
      }

      // Show success message
      showToast(responseData.message || 'Élément supprimé avec succès', 'success');
      
      // Refresh data
      fetchData(activeEndpoint);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      showToast(`Erreur: ${error instanceof Error ? error.message : 'Une erreur est survenue'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    if (!activeEndpoint) return;
    
    try {
      const isEditing = editingItem && editingItem.id;
      let apiUrl = isEditing 
        ? `${serverUrl}/${activeEndpoint}/update/${editingItem.id}`
        : `${serverUrl}/${activeEndpoint}/create`;
      let requestBody = {};

      switch(activeEndpoint) {
        case 'sacha':
          requestBody = {
            author: formData.author || 'Anonyme',
            text: formData.text || '',
            rating: formData.rating ? parseInt(formData.rating) : 5
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

      console.log('Envoi des données à:', apiUrl);
      console.log('Données envoyées:', requestBody);
      
      const response = await fetch(apiUrl, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'envoi des données');
      }
      
      const result = await response.json();
      console.log('Réponse du serveur:', result);
      
      // Show success message
      showToast(result.message || (isEditing ? 'Élément modifié avec succès' : 'Élément créé avec succès'), 'success');
      
      setIsModalOpen(false);
      setEditingItem(null);
      
      // Recharger les données
      if (activeEndpoint) {
        fetchData(activeEndpoint);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      showToast(`Erreur: ${error instanceof Error ? error.message : 'Une erreur est survenue'}`, 'error');
    }
  };
  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url(/sacha-background.jpeg)' }}>
      <div className="min-h-screen backdrop-blur-sm">
        <div className="container mx-auto px-4 h-full">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-[calc(100vh-2rem)] py-4">
            {/* Colonne de gauche - 2/5 de largeur */}
            <div className="w-full lg:w-2/5 h-auto lg:h-full">
              <GlassDiv className="h-auto lg:h-full">
                <h2 className="text-xl font-semibold mb-2 text-center">Voici Sacha</h2>
                <p className="text-center text-gray-200/90">Par SachAPI</p>
                <div className="flex justify-center mb-6">
                  <img src="/sacha-body.png" alt="Sacha" className="max-w-full h-auto" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 px-2">
                  {endpoints.map((endpoint) => (
                    <button
                      key={endpoint.id}
                      onClick={() => handleButtonClick(endpoint.id)}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${activeEndpoint === endpoint.id
                        ? 'bg-purple-700/80 text-white shadow-lg shadow-purple-500/30 border border-purple-400/30'
                        : 'bg-gray-800/40 hover:bg-gray-700/60 text-gray-200 hover:text-white border border-gray-600/30 hover:border-purple-500/50'
                        }`}
                    >
                      {endpoint.label}
                    </button>
                  ))}
                </div>
              </GlassDiv>
            </div>

            {/* Colonne de droite - 3/5 de largeur */}
            <div className="w-full lg:w-3/5 h-auto lg:h-full">
              <GlassDiv className="h-auto lg:h-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-center flex-grow">
                    {activeEndpoint
                      ? endpoints.find(e => e.id === activeEndpoint)?.label || 'Détails'
                      : 'Sélectionnez une option'}
                  </h2>
                  {activeEndpoint && (
                    <button
                      onClick={() => fetchData(activeEndpoint)}
                      className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 rounded-lg transition-all"
                      title="Actualiser"
                    >
                      🔄
                    </button>
                  )}
                </div>
                <div className="p-4 bg-gray-900/30 rounded-lg min-h-[400px] lg:h-[calc(100%-3rem)] border border-purple-500/20 flex flex-col">
                  <div className="flex-grow overflow-y-auto">
                    {loading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                      </div>
                    ) : error ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-red-400 text-center">{error}</p>
                      </div>
                    ) : activeEndpoint ? (
                      <div className="space-y-4">
                        {activeEndpoint !== 'health' && data.length > 0 && (
                          <div className="flex justify-between items-center mb-4 p-2 bg-purple-500/20 rounded-lg">
                            <span className="text-sm text-purple-200">
                              {data.length} élément{data.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                        {data.length === 0 ? (
                          <p className="text-center text-gray-400">Aucune donnée disponible</p>
                        ) : (
                          data.map((item, index) => (
                            <DataCard 
                              key={item.id || index} 
                              item={item} 
                              endpoint={activeEndpoint}
                              onUpdate={(id) => handleUpdate(id)}
                              onDelete={(id) => handleDelete(id)}
                            />
                          ))
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-center text-gray-300/70">
                          Sélectionnez une option dans le menu de gauche
                        </p>
                      </div>
                    )}
                  </div>
                  {activeEndpoint && activeEndpoint !== 'health' && (
                    <div className="flex justify-end pt-4 border-t border-purple-500/20 mt-auto">
                      <button 
                        onClick={handleAddClick}
                        className="px-6 py-2 rounded-lg transition-all duration-200 bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30 border border-purple-400/30 hover:shadow-purple-500/50 text-sm"
                      >
                        Ajouter
                      </button>
                    </div>
                  )}
                </div>
              </GlassDiv>
              
              {/* Modal d'ajout */}
              {activeEndpoint && activeEndpoint !== 'health' && (
                <AddModal
                  isOpen={isModalOpen}
                  onClose={handleCloseModal}
                  endpoint={endpoints.find(e => e.id === activeEndpoint)?.label || ''}
                  endpointType={activeEndpoint as 'sacha' | 'skills' | 'hobbies' | 'name'}
                  isEditing={!!editingItem}
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
                              defaultValue={editingItem?.author || ''}
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
                              defaultValue={editingItem?.text || ''}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Note (1-5)
                            </label>
                            <select
                              name="rating"
                              defaultValue={editingItem?.rating || 5}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            >
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <option key={rating} value={rating}>
                                  {rating} étoile{rating > 1 ? 's' : ''}
                                </option>
                              ))}
                            </select>
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
                              defaultValue={editingItem?.name || ''}
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
                              defaultValue={editingItem?.level || 'Beginner'}
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
                              defaultValue={editingItem?.category || 'Autre'}
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
                              defaultValue={editingItem?.name || ''}
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
                              defaultValue={editingItem?.description || ''}
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
                              defaultValue={editingItem?.level || ''}
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
                              defaultValue={editingItem?.since || new Date().getFullYear()}
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
                            defaultValue={editingItem?.name || ''}
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
                          {editingItem ? 'Modifier' : 'Enregistrer'}
                        </button>
                      </div>
                    </div>
                  </form>
                </AddModal>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
