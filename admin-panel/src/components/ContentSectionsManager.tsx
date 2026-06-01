/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Briefcase, 
  Layers, 
  Film, 
  MapPin, 
  Globe, 
  FileText, 
  MessageSquare, 
  Phone, 
  Mail, 
  Save, 
  Plus, 
  Trash2, 
  Edit2, 
  Sparkles, 
  Play, 
  PlusCircle, 
  HelpCircle,
  Menu,
  Check,
  Search,
  CheckSquare,
  Square,
  CheckCircle,
  X,
  PlusSquare,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { 
  ServiceItem, 
  AddOnItem, 
  ShowcaseReel, 
  ContactDetails, 
  HeroContent, 
  NavbarLabel 
} from '../types';

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error ?? new Error(`Unable to read file ${file.name}`));
    reader.readAsDataURL(file);
  });

const prettyFileLabel = (fileName: string) =>
  fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

interface ContentSectionsManagerProps {
  currentTab: 'services' | 'addons' | 'showcase' | 'general-content' | 'contact';
  
  heroContent: HeroContent;
  onSaveHeroContent: (updated: HeroContent) => void;

  services: ServiceItem[];
  onSaveService: (item: ServiceItem) => void;
  onDeleteService: (id: string) => void;

  addons: AddOnItem[];
  onSaveAddon: (item: AddOnItem) => void;
  onDeleteAddon: (id: string) => void;

  reels: ShowcaseReel[];
  onSaveReel: (item: ShowcaseReel) => void;
  onDeleteReel: (id: string) => void;

  contactDetails: ContactDetails;
  onSaveContactDetails: (updated: ContactDetails) => void;

  navbarLabels: NavbarLabel[];
  onSaveNavbarLabels: (updated: NavbarLabel[]) => void;

  onLogActivity: (type: 'service' | 'addon' | 'media' | 'general' | 'seo', action: string, details: string) => void;
}

export default function ContentSectionsManager({
  currentTab,
  heroContent,
  onSaveHeroContent,
  services,
  onSaveService,
  onDeleteService,
  addons,
  onSaveAddon,
  onDeleteAddon,
  reels,
  onSaveReel,
  onDeleteReel,
  contactDetails,
  onSaveContactDetails,
  navbarLabels,
  onSaveNavbarLabels,
  onLogActivity
}: ContentSectionsManagerProps) {
  
  // Editor and Create toggle states
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isServiceNew, setIsServiceNew] = useState(false);

  const [editingAddon, setEditingAddon] = useState<AddOnItem | null>(null);
  const [isAddonNew, setIsAddonNew] = useState(false);

  const [editingReel, setEditingReel] = useState<ShowcaseReel | null>(null);
  const [isReelNew, setIsReelNew] = useState(false);

  // States inside General Hero Contents
  const [tempHero, setTempHero] = useState<HeroContent>({ ...heroContent });
  const [tempContact, setTempContact] = useState<ContactDetails>({ ...contactDetails });

  // Navbar Labels local operations state
  const [newNavLink, setNewNavLink] = useState('');
  const [newNavPath, setNewNavPath] = useState('');

  // Initial Sync Helpers
  React.useEffect(() => {
    setTempHero({ ...heroContent });
  }, [heroContent]);

  React.useEffect(() => {
    setTempContact({ ...contactDetails });
  }, [contactDetails]);

  // SERVICES CRUD METRICS
  const handleCreateService = () => {
    setIsServiceNew(true);
    setEditingService({
      id: `srv-${Date.now()}`,
      title: '',
      description: '',
      icon: 'Briefcase',
      priceRange: '',
      status: 'Draft'
    });
  };

  const handleSaveService = () => {
    if (!editingService || !editingService.title.trim()) return;
    onSaveService(editingService);
    onLogActivity('service', isServiceNew ? 'create' : 'update', 
      `${isServiceNew ? 'Created new' : 'Updated'} business service: "${editingService.title}"`
    );
    setEditingService(null);
  };

  // ADDONS CRUD METRICS
  const handleCreateAddon = () => {
    setIsAddonNew(true);
    setEditingAddon({
      id: `add-${Date.now()}`,
      title: '',
      description: '',
      price: '',
      status: 'Draft'
    });
  };

  const handleSaveAddon = () => {
    if (!editingAddon || !editingAddon.title.trim()) return;
    onSaveAddon(editingAddon);
    onLogActivity('addon', isAddonNew ? 'create' : 'update', 
      `${isAddonNew ? 'Added new' : 'Modified'} service add-on: "${editingAddon.title}"`
    );
    setEditingAddon(null);
  };

  // SHOWCASE REELS CRUD METRICS
  const handleCreateReel = () => {
    setIsReelNew(true);
    setEditingReel({
      id: `reel-${Date.now()}`,
      title: '',
      videoUrl: '',
      thumbnailUrl: '',
      views: '0 views',
      status: 'Draft'
    });
  };

  const handleSaveReel = () => {
    if (!editingReel || !editingReel.title.trim()) return;
    if (!editingReel.videoUrl.trim()) {
      alert('Please upload a video file for the reel.');
      return;
    }
    onSaveReel(editingReel);
    onLogActivity('media', isReelNew ? 'create' : 'update', 
      `${isReelNew ? 'Created new' : 'Edited'} showcase video reel: "${editingReel.title}"`
    );
    setEditingReel(null);
  };

  const handleHeroBackgroundUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      const file = Array.from(files).find(item => item.type.startsWith('image/'));
      if (!file) {
        alert('Please choose an image file.');
        return;
      }
      const uploadedBackground = await readFileAsDataUrl(file);
      setTempHero(prev => ({ ...prev, backgroundImage: uploadedBackground }));
    } catch (error) {
      console.error('Failed to upload hero background:', error);
      alert('The hero background image could not be uploaded. Please try again.');
    }
  };

  const handleReelVideoUpload = async (files: FileList | null) => {
    if (!editingReel || !files || files.length === 0) return;
    try {
      const file = Array.from(files).find(item => item.type.startsWith('video/'));
      if (!file) {
        alert('Please choose a video file.');
        return;
      }
      const uploadedVideo = await readFileAsDataUrl(file);
      setEditingReel({
        ...editingReel,
        videoUrl: uploadedVideo,
        title: editingReel.title || prettyFileLabel(file.name) || 'Uploaded Reel'
      });
    } catch (error) {
      console.error('Failed to upload reel video:', error);
      alert('The reel video could not be uploaded. Please try again.');
    }
  };

  const handleReelThumbnailUpload = async (files: FileList | null) => {
    if (!editingReel || !files || files.length === 0) return;
    try {
      const file = Array.from(files).find(item => item.type.startsWith('image/'));
      if (!file) {
        alert('Please choose an image file.');
        return;
      }
      const uploadedThumbnail = await readFileAsDataUrl(file);
      setEditingReel({
        ...editingReel,
        thumbnailUrl: uploadedThumbnail
      });
    } catch (error) {
      console.error('Failed to upload reel thumbnail:', error);
      alert('The reel thumbnail could not be uploaded. Please try again.');
    }
  };

  // GENERAL HERO BANNER SAVING
  const handleSaveHero = () => {
    onSaveHeroContent(tempHero);
    onLogActivity('general', 'update', "Updated homepage hero banner overlay texts");
    alert("Hero banner content updated successfully.");
  };

  // CONTACT, SEO & COPYRIGHT SAVING
  const handleSaveContact = () => {
    onSaveContactDetails(tempContact);
    onLogActivity('seo', 'update', "Saved company phone credentials and SEO meta descriptors");
    alert("Contact & SEO details saved successfully.");
  };

  // NAVBAR LABLES MANAGEMENT
  const handleAddNavLink = () => {
    if (!newNavLink.trim() || !newNavPath.trim()) return;
    const labels = [...navbarLabels, {
      id: `nav-${Date.now()}`,
      label: newNavLink.trim(),
      path: newNavPath.trim()
    }];
    onSaveNavbarLabels(labels);
    onLogActivity('general', 'create', `Created new navigation link label "${newNavLink}"`);
    setNewNavLink('');
    setNewNavPath('');
  };

  const handleDeleteNavLink = (id: string, lbl: string) => {
    const labels = navbarLabels.filter(item => item.id !== id);
    onSaveNavbarLabels(labels);
    onLogActivity('general', 'delete', `Deleted navigation link label "${lbl}"`);
  };

  const moveNavLink = (index: number, direction: 'up' | 'down') => {
    const nextIdx = direction === 'up' ? index - 1 : index + 1;
    if (nextIdx < 0 || nextIdx >= navbarLabels.length) return;

    const list = [...navbarLabels];
    const temp = list[index];
    list[index] = list[nextIdx];
    list[nextIdx] = temp;
    onSaveNavbarLabels(list);
  };

  return (
    <div id="sections-manager-wrapper" className="space-y-6">

      {/* RENDER TAB 1: SERVICES MANAGER */}
      {currentTab === 'services' && (
        <div className="space-y-6">
          {!editingService ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-emerald-400" />
                    Business Services ({services.length})
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Add or edit the service cards shown on the website.
                  </p>
                </div>
                <button
                  id="create-service-btn"
                  onClick={handleCreateService}
                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2 px-3.5 rounded-xl transition shadow active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Add GMM Service
                </button>
              </div>

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((srv) => (
                  <div key={srv.id} className="bg-zinc-950/40 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-zinc-700/80 transition group relative">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                          G
                        </div>
                        <span className={`text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          srv.status === 'Published' ? 'bg-emerald-950/60 text-emerald-400' : 'bg-zinc-900 text-zinc-500'
                        }`}>
                          {srv.status}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white tracking-wide font-sans">{srv.title}</h4>
                        {srv.priceRange && (
                          <p className="text-xs font-mono text-emerald-400">{srv.priceRange}</p>
                        )}
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans">{srv.description}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-900 flex justify-end gap-2">
                      <button
                        id={`edit-srv-${srv.id}`}
                        onClick={() => { setEditingService({ ...srv }); setIsServiceNew(false); }}
                        className="text-xs text-zinc-300 bg-zinc-900 hover:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-800 transition flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        id={`delete-srv-${srv.id}`}
                        onClick={() => {
                          if (confirm(`Delete service "${srv.title}"?`)) {
                            onDeleteService(srv.id);
                            onLogActivity('service', 'delete', `Deleted business service "${srv.title}"`);
                          }
                        }}
                        className="text-xs text-zinc-555 hover:text-rose-400 bg-zinc-900 hover:bg-rose-950/30 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-rose-900/30 transition text-zinc-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Edit Panel
            <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6 space-y-6">
              <h3 className="text-md font-bold text-white border-b border-zinc-900 pb-3 font-sans">
                {isServiceNew ? "Add Core Business Line" : `Edit Service: ${editingService.title || 'Untitled'}`}
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400 block">Service Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Property Mutation & Land Registry"
                      value={editingService.title}
                      onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Price range */}
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400 block">Service Pricing / Cost range</label>
                    <input
                      type="text"
                      placeholder="e.g. Commission starting from 1% / ₹15,000"
                      value={editingService.priceRange || ''}
                      onChange={(e) => setEditingService({ ...editingService, priceRange: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 block">Description Summary</label>
                  <textarea
                    rows={4}
                    placeholder="Provide full description of the legal, financial, or brokerage steps..."
                    value={editingService.description}
                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl p-3 text-xs focus:outline-none"
                  />
                </div>

                {/* Status Toggle */}
                <div className="flex items-center gap-3 bg-zinc-900 p-3 rounded-xl border border-zinc-800 w-fit">
                  <span className="text-xs text-zinc-400 font-sans">State:</span>
                  <button
                    onClick={() => setEditingService({ ...editingService, status: editingService.status === 'Published' ? 'Draft' : 'Published' })}
                    className={`text-[10px] px-2.5 py-1 rounded-md font-bold transition-all uppercase ${
                      editingService.status === 'Published'
                        ? 'bg-emerald-900/40 text-emerald-400'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {editingService.status}
                  </button>
                </div>

                {/* Actions bottom */}
                <div className="pt-4 border-t border-zinc-900 flex justify-end gap-2">
                  <button
                    onClick={() => { setEditingService(null); setIsServiceNew(false); }}
                    className="text-xs text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 px-4 py-2 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    id="save-service-btn"
                    onClick={handleSaveService}
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 font-semibold text-white px-4 py-2 rounded-xl transition shadow active:scale-95"
                  >
                    Save business Line
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RENDER TAB 2: SERVICE ADD-ONS */}
      {currentTab === 'addons' && (
        <div className="space-y-6">
          {!editingAddon ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-400" />
                    Service Add-ons & Extra Charges
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Manage virtual 3D VR setups, drone shoot offers, or expedited historic check prices.
                  </p>
                </div>
                <button
                  id="create-addon-btn"
                  onClick={handleCreateAddon}
                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2 px-3.5 rounded-xl transition shadow active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Add Service Add-on
                </button>
              </div>

              {/* Addones List Table */}
              <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-950/25 text-zinc-400 text-[10px] font-mono uppercase tracking-wider">
                      <th className="py-4 px-6">Name & Description</th>
                      <th className="py-4 px-4">Fixed Fee</th>
                      <th className="py-4 px-4 text-center">Status</th>
                      <th className="py-4 px-6 text-right">Settings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {addons.map((add) => (
                      <tr key={add.id} className="hover:bg-zinc-900/40 transition">
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <p className="font-semibold text-zinc-100 text-sm">{add.title}</p>
                            <p className="text-zinc-400 max-w-xl leading-relaxed text-[11px]">{add.description}</p>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-mono font-bold text-zinc-200">
                          {add.price || 'By Quote'}
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase font-mono ${
                            add.status === 'Published' ? 'bg-emerald-950/60 text-emerald-400' : 'bg-zinc-900 text-zinc-500'
                          }`}>
                            {add.status}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              id={`edit-addon-${add.id}`}
                              onClick={() => { setEditingAddon({ ...add }); setIsAddonNew(false); }}
                              className="p-1 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-850 transition text-[11px]"
                            >
                              Edit
                            </button>
                            <button
                              id={`delete-addon-${add.id}`}
                              onClick={() => {
                                if (confirm(`Delete add-on "${add.title}"?`)) {
                                  onDeleteAddon(add.id);
                                  onLogActivity('addon', 'delete', `Deleted add-on "${add.title}"`);
                                }
                              }}
                              className="p-1 px-2 text-zinc-500 hover:text-rose-400 bg-zinc-900 hover:bg-rose-950/40 rounded border border-zinc-850 hover:border-rose-900/30 transition text-[11px]"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            // Edit/Create Panel
            <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6 space-y-6">
              <h3 className="text-md font-bold text-white border-b border-zinc-900 pb-3">
                {isAddonNew ? "Add New service Extra" : "Modify Service Add-on"}
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400 block">Add-on Label/Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Aerial High-Def Drone Video Shoot"
                      value={editingAddon.title}
                      onChange={(e) => setEditingAddon({ ...editingAddon, title: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400 block">Unit Cost / Description price</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹12,000 flat per flight"
                      value={editingAddon.price || ''}
                      onChange={(e) => setEditingAddon({ ...editingAddon, price: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 block">Full Description Details</label>
                  <textarea
                    rows={3}
                    placeholder="Detail layout what user gets when purchasing this extra..."
                    value={editingAddon.description}
                    onChange={(e) => setEditingAddon({ ...editingAddon, description: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl p-3 text-xs focus:outline-none"
                  />
                </div>

                {/* Status */}
                <div className="flex items-center gap-3 bg-zinc-900 p-3 rounded-xl border border-zinc-800 w-fit">
                  <span className="text-xs text-zinc-400 font-sans">State:</span>
                  <button
                    onClick={() => setEditingAddon({ ...editingAddon, status: editingAddon.status === 'Published' ? 'Draft' : 'Published' })}
                    className={`text-[10px] px-2.5 py-1 rounded-md font-bold transition-all uppercase ${
                      editingAddon.status === 'Published'
                        ? 'bg-emerald-900/40 text-emerald-400'
                        : 'bg-zinc-850 text-zinc-500'
                    }`}
                  >
                    {editingAddon.status}
                  </button>
                </div>

                <div className="pt-4 border-t border-zinc-900 flex justify-end gap-2">
                  <button
                    onClick={() => { setEditingAddon(null); setIsAddonNew(false); }}
                    className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    id="save-addon-btn"
                    onClick={handleSaveAddon}
                    className="text-xs bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl transition"
                  >
                    Save Service Add-on
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RENDER TAB 3: SHOWCASE REELS */}
      {currentTab === 'showcase' && (
        <div className="space-y-6">
          {!editingReel ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
                    <Film className="w-5 h-5 text-emerald-400" />
                    Showcase Videos ({reels.length})
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Upload and manage the short videos shown on the site.
                  </p>
                </div>
                <button
                  id="create-reel-btn"
                  onClick={handleCreateReel}
                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2 px-3.5 rounded-xl transition shadow active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Add Story Reel
                </button>
              </div>

              {/* Grid lists */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {reels.map((rl) => (
                  <div key={rl.id} className="bg-zinc-950/40 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between group">
                    <div className="aspect-[9/12] w-full bg-zinc-900 relative">
                      {rl.thumbnailUrl ? (
                        <img
                          src={rl.thumbnailUrl}
                          alt={rl.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500 text-xs font-mono">
                          Uploaded thumbnail not set
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent flex flex-col justify-between p-4">
                        {/* Top indicators */}
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] bg-black/60 font-mono text-zinc-300 px-2 py-0.5 rounded backdrop-blur">
                            {rl.views || '0 views'}
                          </span>
                          <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded uppercase ${
                            rl.status === 'Published' ? 'bg-emerald-600 text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-500'
                          }`}>
                            {rl.status}
                          </span>
                        </div>

                        {/* Mid play indicator icon */}
                        <div className="self-center p-3 rounded-full bg-emerald-600/90 text-white ring-4 ring-emerald-500/10 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300">
                          <Play className="w-6 h-6 fill-white" />
                        </div>

                        {/* Bottom context details */}
                        <div className="space-y-1">
                          <p className="font-bold text-white tracking-wide text-xs drop-shadow-md sm:text-sm">{rl.title}</p>
                          <span className="text-[10px] text-zinc-400 block font-mono truncate">
                            {rl.videoUrl ? 'Uploaded video file ready' : 'Upload a video file to preview'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-zinc-950 border-t border-zinc-900 flex justify-end gap-1.5 text-[11px]">
                      <button
                        id={`edit-reel-${rl.id}`}
                        onClick={() => { setEditingReel({ ...rl }); setIsReelNew(false); }}
                        className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 rounded hover:border-zinc-700 transition font-medium text-zinc-300 hover:text-white"
                      >
                        Edit Clip
                      </button>
                      <button
                        id={`delete-reel-${rl.id}`}
                        onClick={() => {
                          if (confirm(`Delete video reel "${rl.title}"?`)) {
                            onDeleteReel(rl.id);
                            onLogActivity('media', 'delete', `Deleted video story loop "${rl.title}"`);
                          }
                        }}
                        className="px-2 py-1.5 bg-zinc-900 hover:bg-rose-950 font-medium rounded border border-zinc-850 hover:border-rose-900 text-zinc-500 hover:text-rose-400 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Edit Frame
            <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6 space-y-6">
              <h3 className="text-md font-bold text-white border-b border-zinc-900 pb-3">
                {isReelNew ? "Upload New Walkthrough Reel" : "Edit Video Story Properties"}
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400 block">Reel Caption / Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Waterfront Penthouse drone preview"
                      value={editingReel.title}
                      onChange={(e) => setEditingReel({ ...editingReel, title: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>

                  {/* Views counter mockup */}
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400 block">Initial Views Count</label>
                    <input
                      type="text"
                      placeholder="e.g. 5.1k views"
                      value={editingReel.views || ''}
                      onChange={(e) => setEditingReel({ ...editingReel, views: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Video upload */}
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400 block">Upload MP4 / Video File</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        void handleReelVideoUpload(e.target.files);
                        e.currentTarget.value = '';
                      }}
                      className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 text-xs file:mr-3 file:rounded-md file:border-0 file:bg-emerald-600 file:text-white file:px-3 file:py-1.5 file:cursor-pointer hover:file:bg-emerald-500"
                    />
                    <span className="text-[10px] text-zinc-500 font-mono">Upload an actual video file from your device.</span>
                  </div>

                  {/* Poster Thumbnail upload */}
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400 block">Upload Cover Thumbnail</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        void handleReelThumbnailUpload(e.target.files);
                        e.currentTarget.value = '';
                      }}
                      className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 text-xs file:mr-3 file:rounded-md file:border-0 file:bg-emerald-600 file:text-white file:px-3 file:py-1.5 file:cursor-pointer hover:file:bg-emerald-500"
                    />
                  </div>
                </div>

                {editingReel.videoUrl ? (
                  <div className="space-y-2">
                    <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Video Preview</p>
                    <video
                      src={editingReel.videoUrl}
                      className="w-full max-h-[340px] rounded-2xl border border-zinc-800 bg-black"
                      controls
                      preload="metadata"
                    />
                  </div>
                ) : null}

                {/* State Status Draft/Published */}
                <div className="flex items-center gap-3 bg-zinc-900 p-3 rounded-xl border border-zinc-800 w-fit">
                  <span className="text-xs text-zinc-400 font-sans">State:</span>
                  <button
                    onClick={() => setEditingReel({ ...editingReel, status: editingReel.status === 'Published' ? 'Draft' : 'Published' })}
                    className={`text-[10px] px-2.5 py-1 rounded-md font-bold transition-all uppercase ${
                      editingReel.status === 'Published'
                        ? 'bg-emerald-900/40 text-emerald-400'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {editingReel.status}
                  </button>
                </div>

                <div className="pt-4 border-t border-zinc-900 flex justify-end gap-2">
                  <button
                    onClick={() => { setEditingReel(null); setIsReelNew(false); }}
                    className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    id="save-reel-btn"
                    onClick={handleSaveReel}
                    className="text-xs bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl transition"
                  >
                    Save Reel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RENDER TAB 4: HERO BANNER OVERLAY TEXTS & NAVBAR LABELS */}
      {currentTab === 'general-content' && (
        <div className="space-y-6">
          <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-md font-bold tracking-tight text-white font-sans flex items-center gap-2 border-b border-zinc-900 pb-3">
              <PlusSquare className="w-5 h-5 text-emerald-400" />
              Home Page Text
            </h2>

            <div className="space-y-4">
              {/* Image banner backgrounds */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Banner title text */}
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-sans">Brand Hero Banner Title Headline</label>
                  <input
                    type="text"
                    value={tempHero.title}
                    onChange={(e) => setTempHero({ ...tempHero, title: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                {/* Image BG Upload */}
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 block">Upload Hero Background Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      void handleHeroBackgroundUpload(e.target.files);
                      e.currentTarget.value = '';
                    }}
                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 text-xs file:mr-3 file:rounded-md file:border-0 file:bg-emerald-600 file:text-white file:px-3 file:py-1.5 file:cursor-pointer hover:file:bg-emerald-500"
                  />
                  <span className="text-[10px] text-zinc-500 font-mono block">
                    Upload an actual image from your computer. It will be saved as data, not a pasted link.
                  </span>
                </div>
              </div>

              {tempHero.backgroundImage ? (
                <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
                  <img
                    src={tempHero.backgroundImage}
                    alt="Hero background preview"
                    className="h-52 w-full object-cover"
                  />
                </div>
              ) : null}

              {/* Subtitle textarea */}
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400">Descriptive Section Subtitle</label>
                <textarea
                  rows={2}
                  value={tempHero.subtitle}
                  onChange={(e) => setTempHero({ ...tempHero, subtitle: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl p-3 text-xs focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                />
              </div>

              {/* CTA actions button labels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Primary Button Label (e.g. Buy Properties)</label>
                  <input
                    type="text"
                    value={tempHero.primaryButtonText}
                    onChange={(e) => setTempHero({ ...tempHero, primaryButtonText: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-850 text-zinc-100 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Secondary Button Label (e.g. Consultation)</label>
                  <input
                    type="text"
                    value={tempHero.secondaryButtonText}
                    onChange={(e) => setTempHero({ ...tempHero, secondaryButtonText: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-850 text-zinc-100 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              {/* Save Hero button */}
              <div className="flex justify-end pt-2">
                <button
                  id="save-hero-banner-btn"
                  onClick={handleSaveHero}
                  className="bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs text-white py-2 px-4 rounded-xl transition flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Homepage Hero Config
                </button>
              </div>
            </div>
          </div>

          {/* NAVBAR LINK LABELS MANAGER */}
          <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-md font-bold tracking-tight text-white font-sans flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                Menu Labels ({navbarLabels.length})
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Rename the labels shown in the site menu.
              </p>
            </div>

            {/* Addition form */}
            <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-xl flex flex-col sm:flex-row items-end gap-3">
              <div className="flex-1 w-full space-y-1">
                <label className="text-xs text-zinc-400">Anchor text label (e.g. NRI Lounge)</label>
                <input
                  type="text"
                  placeholder="e.g. Commercial Plots"
                  value={newNavLink}
                  onChange={(e) => setNewNavLink(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg px-3 py-1.5 text-xs"
                />
              </div>

              <div className="flex-1 w-full space-y-1">
                <label className="text-xs text-zinc-400">Relative Path target link</label>
                <input
                  type="text"
                  placeholder="e.g. /commercial-plots"
                  value={newNavPath}
                  onChange={(e) => setNewNavPath(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-1.5 text-xs font-mono"
                />
              </div>

              <button
                id="add-nav-link-btn"
                onClick={handleAddNavLink}
                disabled={!newNavLink.trim() || !newNavPath.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 text-xs py-2 px-3.5 rounded-lg transition shrink-0 flex items-center gap-1 font-semibold"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add Label
              </button>
            </div>

            {/* List labels */}
            <div className="space-y-2">
              {navbarLabels.map((lbl, idx) => (
                <div key={lbl.id} className="flex items-center justify-between p-3 bg-zinc-900/60 border border-zinc-900 rounded-xl hover:border-zinc-800 transition">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-650 text-xs font-mono">0{idx + 1}</span>
                    <div>
                      <p className="text-xs font-semibold text-zinc-100">{lbl.label}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">{lbl.path}</p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveNavLink(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 bg-zinc-950 text-zinc-400 hover:text-white rounded border border-zinc-900 disabled:opacity-20"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => moveNavLink(idx, 'down')}
                      disabled={idx === navbarLabels.length - 1}
                      className="p-1 bg-zinc-950 text-zinc-400 hover:text-white rounded border border-zinc-900 disabled:opacity-20"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteNavLink(lbl.id, lbl.label)}
                      className="p-1 bg-zinc-955 hover:bg-rose-955 p-1 rounded hover:text-rose-400 text-zinc-600 transition ml-2"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RENDER TAB 5: CONTACTS, SEO META & FOOTER CONTENT */}
      {currentTab === 'contact' && (
        <div className="space-y-6">
          <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-md font-bold tracking-tight text-white font-sans flex items-center gap-2 border-b border-zinc-900 pb-3">
              <Phone className="w-5 h-5 text-emerald-400" />
              Contact Details
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Telephone */}
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Direct Office Phone number</label>
                  <input
                    type="text"
                    value={tempContact.phone}
                    onChange={(e) => setTempContact({ ...tempContact, phone: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                {/* Email address */}
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Public Contact Email Account</label>
                  <input
                    type="text"
                    value={tempContact.email}
                    onChange={(e) => setTempContact({ ...tempContact, email: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              {/* Lower Parel physical address */}
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400">Office Headquarter Post Address</label>
                <input
                  type="text"
                  value={tempContact.address}
                  onChange={(e) => setTempContact({ ...tempContact, address: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              {/* Maps embed */}
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400">Google Maps Location iframe embed Link</label>
                <input
                  type="text"
                  value={tempContact.gmapsEmbedUrl}
                  onChange={(e) => setTempContact({ ...tempContact, gmapsEmbedUrl: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* WHATSAPP CLICK TO CALL BAR */}
          <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-md font-bold tracking-tight text-white font-sans flex items-center gap-2 border-b border-zinc-900 pb-3">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              WhatsApp Button
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400">Target WhatsApp Mobile (Include Dialcode, no spaces)</label>
                <input
                  type="text"
                  value={tempContact.whatsappNumber}
                  onChange={(e) => setTempContact({ ...tempContact, whatsappNumber: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400">Floating Button Action labels (WhatsApp button text)</label>
                <input
                  type="text"
                  value={tempContact.whatsappButtonText}
                  onChange={(e) => setTempContact({ ...tempContact, whatsappButtonText: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl px-3 py-2 text-xs font-sans"
                />
              </div>
            </div>
          </div>

          {/* SEO OVERLAYS & LEGAL FOOTER */}
          <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-md font-bold tracking-tight text-white font-sans flex items-center gap-2 border-b border-zinc-900 pb-3">
              <FileText className="w-5 h-5 text-emerald-400" />
              SEO & Footer
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Meta title */}
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Browser Page Meta Title (SEO title)</label>
                  <input
                    type="text"
                    value={tempContact.seoTitle}
                    onChange={(e) => setTempContact({ ...tempContact, seoTitle: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                {/* Footer terms */}
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Footer Legal Copyright Disclaimer text</label>
                  <input
                    type="text"
                    value={tempContact.footerText}
                    onChange={(e) => setTempContact({ ...tempContact, footerText: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400">Browser Page Meta Description (SEO description)</label>
                <textarea
                  rows={2}
                  value={tempContact.seoDescription}
                  onChange={(e) => setTempContact({ ...tempContact, seoDescription: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl p-3 text-xs leading-relaxed"
                />
              </div>

              {/* Action button */}
              <div className="flex justify-end pt-2">
                <button
                  id="save-contact-seo-btn"
                  onClick={handleSaveContact}
                  className="bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs text-white py-2 px-4 rounded-xl transition flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Contacts & SEO Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
