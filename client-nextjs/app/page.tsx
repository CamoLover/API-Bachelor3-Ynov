"use client";

import GlassDiv from "./components/GlassDiv";
import AddModal from "./components/AddModal";
import { useState } from 'react';

type Endpoint = 'sacha' | 'skills' | 'hobbies' | 'name' | 'health';

export default function Home() {
  const [activeEndpoint, setActiveEndpoint] = useState<Endpoint | null>(null);

  const endpoints: { id: Endpoint, label: string }[] = [
    { id: 'sacha', label: 'Appréciations' },
    { id: 'skills', label: 'Compétences' },
    { id: 'hobbies', label: 'Loisirs' },
    { id: 'name', label: 'Surnoms' },
    { id: 'health', label: 'Statut API' },
  ];

  const handleButtonClick = (endpoint: Endpoint) => {
    setActiveEndpoint(endpoint);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (formData: any) => {
    if (!activeEndpoint) return;
    
    try {
      let apiUrl = `http://localhost:8000/${activeEndpoint}`;
      let requestBody = {};

      // Préparation du corps de la requête selon l'endpoint
      switch(activeEndpoint) {
        case 'sacha':
          requestBody = {
            author: formData.author || 'Anonyme',
            text: formData.text || '',
            rating: formData.rating ? parseInt(formData.rating) : 5
          };
          break;
        case 'skills':
          apiUrl = 'http://localhost:8000/skills';
          requestBody = {
            name: formData.name || '',
            level: formData.level || 'Beginner',
            category: formData.category || 'Autre'
          };
          break;
        case 'hobbies':
          apiUrl = 'http://localhost:8000/hobbies';
          requestBody = {
            name: formData.name || '',
            description: formData.description || '',
            level: formData.level || 'Débutant',
            since: formData.since || new Date().getFullYear().toString()
          };
          break;
        case 'name':
          apiUrl = 'http://localhost:8000/name';
          requestBody = {
            name: formData.name || ''
          };
          break;
      }

      console.log('Envoi des données à:', apiUrl);
      console.log('Données envoyées:', requestBody);
      
      // À décommenter quand les routes seront prêtes
      /*
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'envoi des données');
      }
      
      const data = await response.json();
      console.log('Réponse du serveur:', data);
      setIsModalOpen(false);
      // Recharger les données si nécessaire
      */
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      // Afficher un message d'erreur à l'utilisateur
      alert(`Erreur: ${error instanceof Error ? error.message : 'Une erreur est survenue'}`);
    }
  };
  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url(/sacha-background.jpeg)' }}>
      <div className="min-h-screen backdrop-blur-sm">
        <div className="container mx-auto px-4 h-full">
          <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-4rem)] py-4">
            {/* Colonne de gauche - 2/5 de largeur */}
            <div className="w-full md:w-2/5 h-full">
              <GlassDiv className="h-full">
                <h2 className="text-xl font-semibold mb-2 text-center">Voici Sacha</h2>
                <p className="text-center text-gray-200/90">Par SachAPI</p>
                <div className="flex justify-center mb-6">
                  <img src="/sacha-body.png" alt="Sacha" className="max-w-full h-auto" />
                </div>
                <div className="flex flex-col space-y-4 px-2">
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
            <div className="w-full md:w-3/5 h-full">
              <GlassDiv className="h-full">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  {activeEndpoint
                    ? endpoints.find(e => e.id === activeEndpoint)?.label || 'Détails'
                    : 'Sélectionnez une option'}
                </h2>
                <div className="p-4 bg-gray-900/30 rounded-lg h-[calc(100%-3rem)] border border-purple-500/20 flex flex-col">
                  <div className="flex-grow flex items-center justify-center">
                    {activeEndpoint ? (
                      <p className="text-center text-gray-200/90">
                        Contenu pour {activeEndpoint} sera affiché ici
                      </p>
                    ) : (
                      <p className="text-center text-gray-300/70">
                        Sélectionnez une option dans le menu de gauche
                      </p>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
