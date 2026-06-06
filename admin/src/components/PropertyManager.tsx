/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  Trash2, 
  Edit2, 
  Eye, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  CheckCircle, 
  X, 
  DollarSign, 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize2, 
  FileCheck,
  Play,
  Film,
  Award,
  Image as ImageIcon,
  Save,
  Undo
} from 'lucide-react';
import { Property, MediaItem, PropertyType, PropertyCategory } from '../types';

interface PropertyManagerProps {
  properties: Property[];
  onSaveProperty: (property: Property) => void;
  onDeleteProperty: (id: string) => void;
  onLogActivity: (type: 'property' | 'media', action: string, details: string) => void;
}

const MAX_IMAGES_PER_PROPERTY = 8;
const MAX_VIDEOS_PER_PROPERTY = 2;
const API_BASE = import.meta.env.DEV ? (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '') : '';
const ADMIN_STORAGE_KEY = 'gmm_admin_token';
const DEMO_ADMIN_TOKEN = 'gmm_demo_token';
const getAdminToken = () => localStorage.getItem(ADMIN_STORAGE_KEY) ?? '';

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error ?? new Error(`Unable to read file ${file.name}`));
    reader.readAsDataURL(file);
  });

const uploadFileViaBackend = async (file: File, mediaType: 'image' | 'video', folder: string) => {
  const fileData = await readFileAsDataUrl(file);
  if (getAdminToken() === DEMO_ADMIN_TOKEN) {
    return fileData;
  }
  const response = await fetch(`${API_BASE}/api/media/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAdminToken()}`
    },
    body: JSON.stringify({
      fileData,
      fileName: file.name,
      folder,
      mediaType
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.details || errorData?.error || `Upload failed for ${file.name}`);
  }

  const payload = await response.json();
  return payload.url as string;
};

const stripExtension = (fileName: string) => fileName.replace(/\.[^.]+$/, '');
const prettyFileLabel = (fileName: string) =>
  stripExtension(fileName)
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export default function PropertyManager({
  properties,
  onSaveProperty,
  onDeleteProperty,
  onLogActivity
}: PropertyManagerProps) {
  // Navigation & state logic inside list/forms
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [editingProp, setEditingProp] = useState<Property | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  // Custom states for uploaded media captions in the editor
  const [customImageTitle, setCustomImageTitle] = useState('');
  const [customVideoTitle, setCustomVideoTitle] = useState('');

  // Interactive Live Slideshow Preview Modal State
  const [slideshowProp, setSlideshowProp] = useState<Property | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Categories/Types for reference
  const categories: PropertyCategory[] = ['Residential', 'Commercial', 'Plot', 'Villa', 'Apartment', 'Warehouse'];
  const types: PropertyType[] = ['Sale', 'Rent', 'Lease'];

  // Handle open editor for new property
  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setCustomImageTitle('');
    setCustomVideoTitle('');
    setEditingProp({
      id: `prop-${Date.now()}`,
      title: '',
      type: 'Sale',
      category: 'Residential',
      state: 'Maharashtra',
      city: 'Mumbai',
      location: '',
      price: 0,
      beds: 0,
      baths: 0,
      squareFeet: 0,
      description: '',
      featured: false,
      reraFlag: false,
      status: 'Draft',
      images: [],
      videos: [],
      createdAt: new Date().toISOString()
    });
  };

  // Handle opening editor for existing property
  const handleEdit = (prop: Property) => {
    setEditingProp({ ...prop });
    setIsCreatingNew(false);
    setCustomImageTitle('');
    setCustomVideoTitle('');
  };

  // Save property action
  const handleSave = () => {
    if (!editingProp) return;
    if (!editingProp.title.trim()) {
      alert('Property title is required');
      return;
    }
    if (editingProp.images.length === 0) {
      alert('Please add at least 1 image for the property gallery');
      return;
    }

    // Ensure exactly 1 image is marked as cover
    const currentImages = [...editingProp.images];
    const hasCover = currentImages.some(img => img.isCoverOrPrimary);
    if (!hasCover && currentImages.length > 0) {
      currentImages[0].isCoverOrPrimary = true;
    }

    const updatedProp = { ...editingProp, images: currentImages };
    onSaveProperty(updatedProp);
    
    // Log Activity
    const detailLog = isCreatingNew 
      ? `Added new property listing "${updatedProp.title}"`
      : `Edited existing property details of "${updatedProp.title}"`;
    onLogActivity('property', isCreatingNew ? 'create' : 'update', detailLog);

    setEditingProp(null);
    setIsCreatingNew(false);
  };

  // Media managers inside the current editing property
  const addImageFilesToGallery = async (files: FileList | null) => {
    if (!editingProp) return;
    if (!files || files.length === 0) return;
    try {
      const remaining = MAX_IMAGES_PER_PROPERTY - editingProp.images.length;
      if (remaining <= 0) {
        alert(`You can upload up to ${MAX_IMAGES_PER_PROPERTY} images maximum per property.`);
        return;
      }
      const selectedFiles = Array.from(files)
        .filter(file => file.type.startsWith('image/'))
        .slice(0, remaining);
      if (selectedFiles.length === 0) {
        alert('Please choose image files only.');
        return;
      }

      const uploadedImages = await Promise.all(selectedFiles.map(async (file, index) => ({
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 4)}-${index}`,
        url: await uploadFileViaBackend(file, 'image', 'gmm/properties/images'),
        isCoverOrPrimary: editingProp.images.length === 0 && index === 0,
        type: 'image' as const,
        title: customImageTitle.trim()
          ? `${customImageTitle.trim()}${selectedFiles.length > 1 ? ` ${index + 1}` : ''}`
          : prettyFileLabel(file.name) || `Gallery Photo ${editingProp.images.length + index + 1}`
      })));

      setEditingProp({
        ...editingProp,
        images: [...editingProp.images, ...uploadedImages]
      });
      setCustomImageTitle('');

      onLogActivity(
        'media',
        'create',
        `Uploaded ${selectedFiles.length} image${selectedFiles.length === 1 ? '' : 's'} to property gallery`
      );
    } catch (error) {
      console.error('Failed to upload images:', error);
      alert('One or more photos could not be uploaded. Please try again.');
    }
  };

  const addVideoFilesToGallery = async (files: FileList | null) => {
    if (!editingProp) return;
    if (!files || files.length === 0) return;
    try {
      const remaining = MAX_VIDEOS_PER_PROPERTY - editingProp.videos.length;
      if (remaining <= 0) {
        alert(`You can upload up to ${MAX_VIDEOS_PER_PROPERTY} videos maximum per property.`);
        return;
      }
      const selectedFiles = Array.from(files)
        .filter(file => file.type.startsWith('video/'))
        .slice(0, remaining);
      if (selectedFiles.length === 0) {
        alert('Please choose video files only.');
        return;
      }

      const uploadedVideos = await Promise.all(selectedFiles.map(async (file, index) => ({
        id: `vid-${Date.now()}-${Math.random().toString(36).substr(2, 4)}-${index}`,
        url: await uploadFileViaBackend(file, 'video', 'gmm/properties/videos'),
        isCoverOrPrimary: editingProp.videos.length === 0 && index === 0,
        type: 'video' as const,
        title: customVideoTitle.trim()
          ? `${customVideoTitle.trim()}${selectedFiles.length > 1 ? ` ${index + 1}` : ''}`
          : prettyFileLabel(file.name) || `Walkthrough Video ${editingProp.videos.length + index + 1}`
      })));

      setEditingProp({
        ...editingProp,
        videos: [...editingProp.videos, ...uploadedVideos]
      });
      setCustomVideoTitle('');

      onLogActivity(
        'media',
        'create',
        `Uploaded ${selectedFiles.length} video${selectedFiles.length === 1 ? '' : 's'} to property gallery`
      );
    } catch (error) {
      console.error('Failed to upload videos:', error);
      alert('One or more videos could not be uploaded. Please try again.');
    }
  };

  // Reorder images
  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (!editingProp) return;
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= editingProp.images.length) return;

    const list = [...editingProp.images];
    const temp = list[index];
    list[index] = list[newIdx];
    list[newIdx] = temp;

    setEditingProp({ ...editingProp, images: list });
  };

  // Reorder videos
  const moveVideo = (index: number, direction: 'up' | 'down') => {
    if (!editingProp) return;
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= editingProp.videos.length) return;

    const list = [...editingProp.videos];
    const temp = list[index];
    list[index] = list[newIdx];
    list[newIdx] = temp;

    setEditingProp({ ...editingProp, videos: list });
  };

  // Set cover photo
  const setCoverPhoto = (imgId: string) => {
    if (!editingProp) return;
    const updatedImages = editingProp.images.map(img => ({
      ...img,
      isCoverOrPrimary: img.id === imgId
    }));
    setEditingProp({ ...editingProp, images: updatedImages });
  };

  // Set primary video
  const setPrimaryVideo = (vidId: string) => {
    if (!editingProp) return;
    const updatedVideos = editingProp.videos.map(vid => ({
      ...vid,
      isCoverOrPrimary: vid.id === vidId
    }));
    setEditingProp({ ...editingProp, videos: updatedVideos });
  };

  // Delete individual media
  const removeImage = (imgId: string) => {
    if (!editingProp) return;
    const updatedImages = editingProp.images.filter(img => img.id !== imgId);
    
    // If the removed image was the cover, promote the first remaining to cover
    if (editingProp.images.find(img => img.id === imgId)?.isCoverOrPrimary && updatedImages.length > 0) {
      updatedImages[0].isCoverOrPrimary = true;
    }

    setEditingProp({ ...editingProp, images: updatedImages });
    onLogActivity('media', 'delete', 'Removed an uploaded property image');
  };

  const removeVideo = (vidId: string) => {
    if (!editingProp) return;
    const updatedVideos = editingProp.videos.filter(vid => vid.id !== vidId);
    
    // Promote cover status if needed
    if (editingProp.videos.find(v => v.id === vidId)?.isCoverOrPrimary && updatedVideos.length > 0) {
      updatedVideos[0].isCoverOrPrimary = true;
    }
    
    setEditingProp({ ...editingProp, videos: updatedVideos });
    onLogActivity('media', 'delete', 'Removed an uploaded property video');
  };

  // Quick list status toggles
  const handleToggleStatus = (prop: Property) => {
    const nextStatus: 'Published' | 'Draft' = prop.status === 'Published' ? 'Draft' : 'Published';
    const updated: Property = { ...prop, status: nextStatus };
    onSaveProperty(updated);
    onLogActivity('property', nextStatus === 'Published' ? 'publish' : 'unpublish', 
      `${nextStatus === 'Published' ? 'Published' : 'Unpublished'} GMM listing: "${prop.title}"`
    );
  };

  const handleToggleFeatured = (prop: Property) => {
    const updated = { ...prop, featured: !prop.featured };
    onSaveProperty(updated);
    onLogActivity('property', 'update', 
      `Toggled featured status of GMM property "${prop.title}" to ${!prop.featured}`
    );
  };

  // Open clean Live Showcase Slideshow Preview modal
  const openSlideshowPreview = (prop: Property) => {
    setSlideshowProp(prop);
    setActiveSlideIndex(0);
  };

  // Filter properties list
  const filteredProperties = properties.filter(prop => {
    const matchSearch = 
      prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchType = filterType === 'All' || prop.type === filterType;
    const matchCategory = filterCategory === 'All' || prop.category === filterCategory;

    return matchSearch && matchType && matchCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* If looking at full properties list */}
      {!editingProp && (
        <div className="space-y-6">
          <div id="prop-section-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                Property Listings
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Add, edit, delete, and preview listings with photos and videos.
              </p>
            </div>

            <button
              id="add-new-property-btn"
              onClick={handleCreateNew}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2 px-4 rounded-xl transition-all shadow-md active:scale-95 self-start sm:self-center"
            >
              <Plus className="w-4 h-4" />
              Add Listing
            </button>
          </div>

          {/* Table Filters Panel */}
          <div className="bg-zinc-950/40 border border-zinc-800 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4">
            {/* Search */}
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                id="prop-search-input"
                type="text"
                placeholder="Search GMM properties by name, city, locality..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-sans"
              />
            </div>

            {/* Type Filter */}
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
              <select
                id="filter-type-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-w-[100px]"
              >
                <option value="All">All Types</option>
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <select
                id="filter-category-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-w-[120px]"
              >
                <option value="All">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Properties Grid Table */}
          <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl overflow-hidden">
            {filteredProperties.length === 0 ? (
              <div className="py-20 text-center space-y-2">
                <p className="text-sm text-zinc-400">No properties fit your filter conditions.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setFilterType('All'); setFilterCategory('All'); }}
                  className="text-xs text-emerald-400 hover:underline font-mono"
                >
                  Reset filters &bull; Show all
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-950/20 text-zinc-400 text-[10px] font-mono uppercase tracking-wider">
                      <th className="py-4 px-6">Location Details</th>
                      <th className="py-4 px-4">Market Class</th>
                      <th className="py-4 px-4">Price (INR)</th>
                      <th className="py-4 px-4">Internal Stats</th>
                      <th className="py-4 px-4 text-center">RERA</th>
                      <th className="py-4 px-4 text-center">Featured</th>
                      <th className="py-4 px-4 text-center">Publish State</th>
                      <th className="py-4 px-6 text-right">Settings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-xs">
                    {filteredProperties.map((prop) => {
                      const propertyImages = Array.isArray(prop.images) ? prop.images : [];
                      const propertyVideos = Array.isArray(prop.videos) ? prop.videos : [];
                      // Get cover photo
                      const coverImg = propertyImages.find(img => img.isCoverOrPrimary)?.url || 
                                       propertyImages[0]?.url || 
                                       "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80";

                      return (
                        <tr key={prop.id} className="hover:bg-zinc-900/40 transition-colors">
                          {/* Title & Cover Photo summary */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={coverImg}
                                alt={prop.title}
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 rounded-lg object-cover bg-zinc-800 border border-zinc-800 shrink-0"
                              />
                              <div className="space-y-1">
                                <p className="font-semibold text-zinc-100 text-sm line-clamp-1">{prop.title}</p>
                                <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-sans">
                                  <MapPin className="w-3 h-3 text-emerald-400" />
                                  <span>{prop.location}, {prop.city}</span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                              <span>{propertyImages.length} photos</span>
                              <span>•</span>
                              <span>{propertyVideos.length} videos</span>
                            </div>
                          </td>

                          {/* Type + Category Badge */}
                          <td className="py-4 px-4">
                            <div className="flex flex-col gap-1 items-start">
                              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                                prop.type === 'Sale' ? 'bg-blue-900/30 text-blue-400' :
                                prop.type === 'Rent' ? 'bg-amber-900/30 text-amber-400' : 'bg-purple-900/30 text-purple-400'
                              }`}>
                                FOR {prop.type}
                              </span>
                              <span className="text-[10px] text-zinc-400 font-mono">
                                {prop.category}
                              </span>
                            </div>
                          </td>

                          {/* Price formatting */}
                          <td className="py-4 px-4 font-semibold text-zinc-100 font-mono">
                            {prop.price >= 10000000 ? (
                              <span>₹{(prop.price / 10000000).toFixed(2)} Cr</span>
                            ) : prop.price >= 100000 ? (
                              <span>₹{(prop.price / 100000).toFixed(2)} Lakhs</span>
                            ) : (
                              <span>₹{prop.price.toLocaleString()}</span>
                            )}
                          </td>

                          {/* Beds/Baths/Sqft */}
                          <td className="py-4 px-4 text-zinc-400 font-mono">
                            <div className="space-y-0.5">
                              {prop.category !== 'Plot' && prop.category !== 'Warehouse' && (
                                <p>{prop.beds} Beds &bull; {prop.baths} Baths</p>
                              )}
                              <p className="text-[11px] text-zinc-500">{prop.squareFeet.toLocaleString()} sq.ft.</p>
                            </div>
                          </td>

                          {/* RERA approval badge */}
                          <td className="py-4 px-4 text-center">
                            {prop.reraFlag ? (
                              <div className="inline-flex items-center gap-1 bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-sans">
                                <Award className="w-3 h-3" />
                                Approved
                              </div>
                            ) : (
                              <span className="text-[10px] text-zinc-500 font-mono">N/A</span>
                            )}
                          </td>

                          {/* Featured toggle */}
                          <td className="py-4 px-4 text-center">
                            <button
                              id={`toggle-featured-${prop.id}`}
                              onClick={() => handleToggleFeatured(prop)}
                              className={`p-1.5 rounded-lg border transition-all ${
                                prop.featured 
                                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-sm shadow-amber-500/5' 
                                  : 'border-zinc-800 text-zinc-650 hover:text-zinc-400 hover:bg-zinc-900'
                              }`}
                              title={prop.featured ? "Remove from Featured items" : "Add to Featured items"}
                            >
                              <Sparkles className="w-4 h-4" />
                            </button>
                          </td>

                          {/* Draft toggle button */}
                          <td className="py-4 px-4 text-center">
                            <button
                              id={`toggle-status-${prop.id}`}
                              onClick={() => handleToggleStatus(prop)}
                              className={`text-[10px] px-2 py-1 rounded-full font-medium tracking-wide transition-all uppercase ${
                                prop.status === 'Published'
                                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/40'
                                  : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                              }`}
                            >
                              {prop.status}
                            </button>
                          </td>

                          {/* Settings button dropdown */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Slideshow button */}
                              <button
                                id={`preview-slideshow-${prop.id}`}
                                onClick={() => openSlideshowPreview(prop)}
                                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-zinc-850 hover:border-zinc-700 transition"
                                title="Visual Slideshow Preview"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit GMM property */}
                              <button
                                id={`edit-prop-${prop.id}`}
                                onClick={() => handleEdit(prop)}
                                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg border border-zinc-850 hover:border-zinc-700 transition"
                                title="Edit Listing Details"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete GMM property */}
                              <button
                                id={`delete-prop-${prop.id}`}
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete property "${prop.title}"?`)) {
                                    onDeleteProperty(prop.id);
                                    onLogActivity('property', 'delete', `Deleted GMM listing "${prop.title}"`);
                                  }
                                }}
                                className="p-1.5 bg-zinc-900 hover:bg-rose-950/40 text-zinc-500 hover:text-rose-400 rounded-lg border border-zinc-850 hover:border-rose-900/40 transition"
                                title="Delete Property Listing"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DETAILED PROPERTY FORM EDITOR GLASS SECTION */}
      {editingProp && (
        <div id="property-editor-container" className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6 space-y-8 animate-fadeIn duration-200">
          
          {/* Editor Header Panel */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
            <div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider font-bold">
                {isCreatingNew ? "ADD NEW REAL ESTATE" : "EDIT LISTING DETAILS"}
              </span>
              <h3 className="text-lg font-bold text-white font-sans mt-0.5">
                {isCreatingNew ? "Create GMM Groups Listing Profile" : `Modify Profile: ${editingProp.title || 'Untitled'}`}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="cancel-editor-btn"
                onClick={() => {
                  setEditingProp(null);
                  setIsCreatingNew(false);
                }}
                className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-semibold text-xs py-2 px-3.5 rounded-xl border border-zinc-800 transition"
              >
                <Undo className="w-3.5 h-3.5" />
                Cancel
              </button>

              <button
                id="save-editor-btn"
                onClick={handleSave}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2 px-4 rounded-xl transition shadow-md shadow-emerald-950/40"
              >
                <Save className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Columns - Form Attributes Fields (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Core Information Card */}
              <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-zinc-300 tracking-wide font-sans border-b border-zinc-900 pb-2">1. CORE DESCRIPTION</h4>
                
                {/* Title */}
                <div className="space-y-1.5">
                  <label id="lbl-prop-title" className="text-xs font-medium text-zinc-400 font-sans block">Property Name / Marketing Title</label>
                  <input
                    id="input-prop-title"
                    type="text"
                    required
                    placeholder="e.g. GMM Signature Waterfront Villa"
                    value={editingProp.title}
                    onChange={(e) => setEditingProp({ ...editingProp, title: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Grid Inputs for Pricing / Type / Category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Price */}
                  <div className="space-y-1.5">
                    <label id="lbl-prop-price" className="text-xs font-medium text-zinc-400 block">Pricing (₹ INR)</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500">₹</span>
                      <input
                        id="input-prop-price"
                        type="number"
                        placeholder="Price"
                        value={editingProp.price || ''}
                        onChange={(e) => setEditingProp({ ...editingProp, price: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg pl-6 pr-3 py-2 text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Property Type */}
                  <div className="space-y-1.5">
                    <label id="lbl-prop-type" className="text-xs font-medium text-zinc-400 block">Listing Type</label>
                    <select
                      id="select-prop-type"
                      value={editingProp.type}
                      onChange={(e) => setEditingProp({ ...editingProp, type: e.target.value as PropertyType })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    >
                      {types.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  {/* Property Category */}
                  <div className="space-y-1.5">
                    <label id="lbl-prop-category" className="text-xs font-medium text-zinc-400 block">Asset Category</label>
                    <select
                      id="select-prop-category"
                      value={editingProp.category}
                      onChange={(e) => setEditingProp({ ...editingProp, category: e.target.value as PropertyCategory })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label id="lbl-prop-desc" className="text-xs font-medium text-zinc-400 block">Detailed Description</label>
                  <textarea
                    id="textarea-prop-desc"
                    rows={4}
                    placeholder="Enter detailed description including luxury features, nearby highlights, specifications..."
                    value={editingProp.description}
                    onChange={(e) => setEditingProp({ ...editingProp, description: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg p-3 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none leading-relaxed font-sans"
                  />
                </div>
              </div>

              {/* Geographic Info Card */}
              <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-zinc-300 tracking-wide font-sans border-b border-zinc-900 pb-2">2. GEOGRAPHY & LOCALITY</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Location/Street address detail */}
                  <div className="space-y-1.5 sm:col-span-1">
                    <label id="lbl-prop-locality" className="text-xs font-medium text-zinc-400 block">Specific Locality / Society</label>
                    <input
                      id="input-prop-locality"
                      type="text"
                      placeholder="e.g. Worli Sea Face"
                      value={editingProp.location}
                      onChange={(e) => setEditingProp({ ...editingProp, location: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-1.5">
                    <label id="lbl-prop-city" className="text-xs font-medium text-zinc-400 block">City</label>
                    <input
                      id="input-prop-city"
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={editingProp.city}
                      onChange={(e) => setEditingProp({ ...editingProp, city: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* State */}
                  <div className="space-y-1.5">
                    <label id="lbl-prop-state" className="text-xs font-medium text-zinc-400 block">State</label>
                    <input
                      id="input-prop-state"
                      type="text"
                      placeholder="e.g. Maharashtra"
                      value={editingProp.state}
                      onChange={(e) => setEditingProp({ ...editingProp, state: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Layout Specifications Metrics Card */}
              <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-zinc-300 tracking-wide font-sans border-b border-zinc-900 pb-2">3. LAYOUT SPECIFICATIONS</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Beds count */}
                  <div className="space-y-1.5">
                    <label id="lbl-prop-beds" className="text-xs font-medium text-zinc-400 block">Bedrooms Counter</label>
                    <input
                      id="input-prop-beds"
                      type="number"
                      placeholder="N/A"
                      disabled={editingProp.category === 'Plot' || editingProp.category === 'Warehouse'}
                      value={editingProp.beds}
                      onChange={(e) => setEditingProp({ ...editingProp, beds: parseInt(e.target.value) || 0 })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none disabled:opacity-40"
                    />
                  </div>

                  {/* Baths count */}
                  <div className="space-y-1.5">
                    <label id="lbl-prop-baths" className="text-xs font-medium text-zinc-400 block">Bathrooms Counter</label>
                    <input
                      id="input-prop-baths"
                      type="number"
                      placeholder="N/A"
                      disabled={editingProp.category === 'Plot'}
                      value={editingProp.baths}
                      onChange={(e) => setEditingProp({ ...editingProp, baths: parseInt(e.target.value) || 0 })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none disabled:opacity-40"
                    />
                  </div>

                  {/* Area Sqft */}
                  <div className="space-y-1.5">
                    <label id="lbl-prop-sqft" className="text-xs font-medium text-zinc-400 block">Square Feet Area (sq.ft)</label>
                    <input
                      id="input-prop-sqft"
                      type="number"
                      placeholder="e.g. 3500"
                      value={editingProp.squareFeet}
                      onChange={(e) => setEditingProp({ ...editingProp, squareFeet: parseInt(e.target.value) || 0 })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Status & Options Toggles layout */}
              <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-zinc-300 tracking-wide font-sans border-b border-zinc-900 pb-2">4. REGULATION & MARKET FEATHERING</h4>
                
                <div className="flex flex-wrap gap-6 text-xs text-zinc-200">
                  {/* RERA */}
                  <label id="lbl-editor-rera" className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      id="chk-editor-rera"
                      type="checkbox"
                      checked={editingProp.reraFlag}
                      onChange={(e) => setEditingProp({ ...editingProp, reraFlag: e.target.checked })}
                      className="rounded border-zinc-800 bg-zinc-950 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-zinc-900 w-4 h-4"
                    />
                    <div>
                      <p className="font-semibold text-zinc-100">Official RERA Approved</p>
                      <p className="text-[10px] text-zinc-500 font-mono">Appends regulatory compliance check badge</p>
                    </div>
                  </label>

                  {/* Featured */}
                  <label id="lbl-editor-featured" className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      id="chk-editor-featured"
                      type="checkbox"
                      checked={editingProp.featured}
                      onChange={(e) => setEditingProp({ ...editingProp, featured: e.target.checked })}
                      className="rounded border-zinc-800 bg-zinc-950 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-zinc-900 w-4 h-4"
                    />
                    <div>
                      <p className="font-semibold text-zinc-100">Featured Listing</p>
                      <p className="text-[10px] text-zinc-500 font-mono">Pins at top of user search feeds</p>
                    </div>
                  </label>

                  {/* Published State Draft vs Publish */}
                  <div className="flex items-center gap-2 bg-zinc-950 py-1.5 px-3 rounded-lg border border-zinc-850 self-start">
                    <span className="text-[11px] text-zinc-400 font-medium">Status Mode:</span>
                    <button
                      id="toggle-editor-published"
                      type="button"
                      onClick={() => setEditingProp({ ...editingProp, status: editingProp.status === 'Published' ? 'Draft' : 'Published' })}
                      className={`text-[10px] px-2.5 py-1 rounded-md font-bold transition-all uppercase ${
                        editingProp.status === 'Published'
                          ? 'bg-emerald-900/40 text-emerald-400'
                          : 'bg-zinc-900 text-zinc-500'
                      }`}
                    >
                      {editingProp.status}
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Columns - Real Media Management Panel (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Image Gallery Manager panel */}
              <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                  <h4 className="text-xs font-bold text-zinc-300 tracking-wide font-sans flex items-center gap-1">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    PHOTO GALLERY CARD ({editingProp.images.length}/8 max)
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-mono">Upload files only</span>
                </div>

                {/* Entry fields */}
                <div className="space-y-2">
                  <label className="block">
                    <span className="text-[10px] text-zinc-400 font-sans block mb-1">Upload photos from your device</span>
                    <input
                      id="input-gallery-files"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        void addImageFilesToGallery(e.target.files);
                        e.currentTarget.value = '';
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg px-2.5 py-2 text-xs file:mr-3 file:rounded-md file:border-0 file:bg-emerald-600 file:text-white file:px-3 file:py-1.5 file:cursor-pointer hover:file:bg-emerald-500"
                    />
                  </label>
                  <input
                    id="input-gallery-image-lbl"
                    type="text"
                    placeholder="Optional shared caption for uploaded photos"
                    value={customImageTitle}
                    onChange={(e) => setCustomImageTitle(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
                  />
                </div>

                {/* Gallery List Reordering List displays */}
                {editingProp.images.length === 0 ? (
                  <div className="py-8 bg-zinc-950/30 rounded-lg border border-dashed border-zinc-850 text-center text-[10px] text-zinc-500">
                    Upload photos above to build the property gallery.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
                    {editingProp.images.map((img, index) => (
                      <div
                        key={img.id}
                        className={`flex items-center gap-2 p-2 bg-zinc-950 rounded-xl border ${
                          img.isCoverOrPrimary ? 'border-emerald-500/40 bg-emerald-950/5' : 'border-zinc-900'
                        }`}
                      >
                        {/* Thumbnail */}
                        <img
                          src={img.url}
                          alt="Thumbnail preview"
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded object-cover bg-zinc-800 shrink-0"
                        />

                        {/* Text Caption details */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold text-zinc-200 truncate leading-tight">
                            {img.title || `Image #${index + 1}`}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              type="button"
                              onClick={() => setCoverPhoto(img.id)}
                              className={`text-[9px] font-mono leading-none tracking-wider px-1.5 py-0.5 rounded ${
                                img.isCoverOrPrimary 
                                  ? 'bg-emerald-600 text-white font-bold' 
                                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                              }`}
                            >
                              {img.isCoverOrPrimary ? "COVER" : "SET COVER"}
                            </button>
                          </div>
                        </div>

                        {/* Reorder Buttons Up/Down + Delete */}
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => moveImage(index, 'up')}
                            className="p-1 bg-zinc-900 text-zinc-400 hover:text-white rounded disabled:opacity-30 transition"
                            title="Move Image Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={index === editingProp.images.length - 1}
                            onClick={() => moveImage(index, 'down')}
                            className="p-1 bg-zinc-900 text-zinc-400 hover:text-white rounded disabled:opacity-30 transition"
                            title="Move Image Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
                            className="p-1 bg-zinc-900 hover:bg-rose-950 hover:text-rose-450 p-1 rounded transition text-zinc-500"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video Gallery manager panel (Max 2) */}
              <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                  <h4 className="text-xs font-bold text-zinc-300 tracking-wide font-sans flex items-center gap-1">
                    <Film className="w-4 h-4 text-emerald-400" />
                    VIDEO REELS ({editingProp.videos.length}/2 max)
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-mono">Upload MP4 files</span>
                </div>

                {/* Entry Inputs */}
                <div className="space-y-2">
                  <label className="block">
                    <span className="text-[10px] text-zinc-400 font-sans block mb-1">Upload walkthrough videos from your device</span>
                    <input
                      id="input-video-files"
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={(e) => {
                        void addVideoFilesToGallery(e.target.files);
                        e.currentTarget.value = '';
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg px-2.5 py-2 text-xs file:mr-3 file:rounded-md file:border-0 file:bg-emerald-600 file:text-white file:px-3 file:py-1.5 file:cursor-pointer hover:file:bg-emerald-500"
                    />
                  </label>
                  <input
                    id="input-video-label"
                    type="text"
                    placeholder="Optional shared title for uploaded videos"
                    value={customVideoTitle}
                    onChange={(e) => setCustomVideoTitle(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
                  />
                </div>

                {/* Video details display */}
                {editingProp.videos.length === 0 ? (
                  <div className="py-6 bg-zinc-950/30 rounded-lg border border-dashed border-zinc-850 text-center text-[10px] text-zinc-500 font-sans">
                    Upload walkthrough videos above to build the media gallery.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {editingProp.videos.map((vid, index) => (
                      <div
                        key={vid.id}
                        className={`flex items-center gap-2 p-2 bg-zinc-950 rounded-xl border ${
                          vid.isCoverOrPrimary ? 'border-amber-500/40 bg-amber-955' : 'border-zinc-900'
                        }`}
                      >
                        <video
                          src={vid.url}
                          className="w-20 h-12 rounded bg-zinc-900 border border-zinc-800 object-cover shrink-0"
                          controls
                          preload="metadata"
                        />

                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold text-zinc-200 truncate leading-tight">
                            {vid.title || `Video clip #${index + 1}`}
                          </p>
                          <span className="text-[9px] text-zinc-500 block truncate font-mono mt-0.5">
                            Uploaded video file
                          </span>
                        </div>

                        {/* Up/Down buttons & delete */}
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => moveVideo(index, 'up')}
                            className="p-1 bg-zinc-900 text-zinc-400 hover:text-white rounded disabled:opacity-30 transition"
                            title="Move Video Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={index === editingProp.videos.length - 1}
                            onClick={() => moveVideo(index, 'down')}
                            className="p-1 bg-zinc-900 text-zinc-400 hover:text-white rounded disabled:opacity-30 transition"
                            title="Move Video Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeVideo(vid.id)}
                            className="p-1 bg-zinc-900 hover:bg-rose-950 hover:text-rose-455 rounded transition text-zinc-500"
                            title="Delete Video"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 5. INTERACTIVE LIVE SLIDESHOW PREVIEW POPUP MODAL */}
      {slideshowProp && (
        <div id="slideshow-preview-modal" className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-900 flex items-center justify-between">
              <div>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                  LIVE WEBSITE PREVIEW OVERVIEW
                </span>
                <h3 className="text-md font-bold text-white mt-1">{slideshowProp.title}</h3>
              </div>
              <button
                id="close-slideshow-btn"
                onClick={() => setSlideshowProp(null)}
                className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Preview Container Body */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Image Slider Stage (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="relative aspect-video rounded-2xl bg-zinc-900 overflow-hidden border border-zinc-800/80 shadow-md">
                  {/* Current Active Image display */}
                  {slideshowProp.images.length > 0 ? (
                    <img
                      src={slideshowProp.images[activeSlideIndex]?.url || slideshowProp.images[0].url}
                      alt="Active Slide Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-all duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs font-mono">
                      No images added
                    </div>
                  )}

                  {/* Badges on Top */}
                  <div className="absolute top-3 left-3 flex gap-1.5 pointer-events-none">
                    <span className="text-[10px] bg-zinc-950/80 text-white backdrop-blur px-2.5 py-0.5 rounded-full font-bold uppercase font-mono tracking-wider">
                      {slideshowProp.category} &bull; For {slideshowProp.type}
                    </span>
                    {slideshowProp.reraFlag && (
                      <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        RERA
                      </span>
                    )}
                  </div>

                  {/* Index overlay */}
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded-full backdrop-blur">
                    {activeSlideIndex + 1} / {slideshowProp.images.length}
                  </div>
                </div>

                {/* Slideshow Selector Dots/Thumbnails */}
                <div className="flex gap-2 overflow-x-auto pb-1 max-w-full">
                  {slideshowProp.images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveSlideIndex(i)}
                      className={`relative w-14 h-10 rounded-lg overflow-hidden border-2 transition shrink-0 ${
                        activeSlideIndex === i ? 'border-emerald-500 scale-105' : 'border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt="Slider mini thumbnail"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {img.isCoverOrPrimary && (
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-bl-md" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Quick Video Player if available */}
                {slideshowProp.videos.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase tracking-wide flex items-center gap-1 mt-4">
                      <Play className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      Property Walkthrough Video
                    </label>
                    <div className="aspect-video rounded-xl overflow-hidden border border-zinc-900 bg-zinc-950">
                      <video
                        src={slideshowProp.videos[0].url}
                        controls
                        className="w-full h-full object-cover"
                        poster={slideshowProp.images[0]?.url}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Specs & Attributes detailed View (5 cols) */}
              <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs uppercase font-bold font-mono tracking-wider text-emerald-400">
                      GMM Groups Listings
                    </h4>
                    <h2 className="text-xl font-bold tracking-tight text-white font-sans leading-snug">
                      {slideshowProp.title}
                    </h2>
                    <p className="text-xs text-zinc-400 font-sans flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      {slideshowProp.location}, {slideshowProp.city}, {slideshowProp.state}
                    </p>
                  </div>

                  {/* Price Banner */}
                  <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800/70">
                    <span className="text-[10px] text-zinc-500 font-semibold block uppercase font-mono">ESTIMATED ASSET VALUATION</span>
                    <p className="text-2xl font-bold text-white font-mono mt-1">
                      {slideshowProp.price >= 10000000 ? (
                        <span>₹{(slideshowProp.price / 10000000).toFixed(2)} Crores</span>
                      ) : slideshowProp.price >= 100000 ? (
                        <span>₹{(slideshowProp.price / 100000).toFixed(2)} Lakhs</span>
                      ) : (
                        <span>₹{slideshowProp.price.toLocaleString()}</span>
                      )}
                    </p>
                  </div>

                  {/* Mini Specification Badges */}
                  <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                    <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-850 space-y-0.5">
                      <BedDouble className="w-4 h-4 mx-auto text-zinc-550 text-blue-400" />
                      <p className="font-bold text-white font-mono">{slideshowProp.beds || 'N/A'}</p>
                      <p className="text-[9px] text-zinc-500 uppercase">Bedrooms</p>
                    </div>

                    <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-850 space-y-0.5">
                      <Bath className="w-4 h-4 mx-auto text-zinc-550 text-purple-400" />
                      <p className="font-bold text-white font-mono">{slideshowProp.baths || 'N/A'}</p>
                      <p className="text-[9px] text-zinc-500 uppercase">Bathrooms</p>
                    </div>

                    <div className="bg-zinc-100/5 bg-zinc-900 p-2.5 rounded-xl border border-zinc-850 space-y-0.5">
                      <Maximize2 className="w-4 h-4 mx-auto text-zinc-550 text-emerald-400" />
                      <p className="font-bold text-white font-mono">{slideshowProp.squareFeet.toLocaleString()}</p>
                      <p className="text-[9px] text-zinc-500 uppercase">Sq. Feet</p>
                    </div>
                  </div>

                  {/* Full Description text area */}
                  <div className="space-y-1.5 bg-zinc-900/50 p-3.5 rounded-xl border border-zinc-850/50 max-h-[140px] overflow-y-auto">
                    <span className="text-[10px] text-zinc-555 text-zinc-400 font-mono uppercase tracking-wide font-semibold block">Listing Details:</span>
                    <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">{slideshowProp.description}</p>
                  </div>
                </div>

                {/* Publishing State Actions */}
                <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="font-sans flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${slideshowProp.status === 'Published' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-650'}`} />
                      Current State: <span className="font-bold uppercase text-white">{slideshowProp.status}</span>
                    </span>
                    <span className="font-mono text-[9px] text-zinc-500">#{slideshowProp.id}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      id="slideshow-toggle-published"
                      onClick={() => {
                        handleToggleStatus(slideshowProp);
                        setSlideshowProp({
                          ...slideshowProp,
                          status: slideshowProp.status === 'Published' ? 'Draft' : 'Published'
                        });
                      }}
                      className={`flex-1 text-center font-semibold text-xs py-2 rounded-xl border transition-all ${
                        slideshowProp.status === 'Published'
                          ? 'border-zinc-800 text-zinc-400 hover:text-white bg-zinc-900'
                          : 'border-emerald-600/30 text-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/45'
                      }`}
                    >
                      {slideshowProp.status === 'Published' ? "Unpublish Listing" : "Publish to live feed"}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
