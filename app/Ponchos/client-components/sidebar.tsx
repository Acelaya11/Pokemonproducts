'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { Category } from './ssr/advanced-filter';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";

interface SidebarProps {
  categories: Category[];
  onCategoryChange: (categoryId: string) => void;
}

export default function Sidebar({ categories, onCategoryChange }: SidebarProps) {
  const [expandedSeries, setExpandedSeries] = useState<Set<string>>(new Set());
  
  const productCategories = categories.filter(cat => cat.type === 'product');
  const energyCategories = categories.filter(cat => cat.type === 'energy');

  const sealedTypeCategories = categories.filter(cat => cat.type === 'sealed_type');
  const seriesCategories = categories.filter(cat => cat.type === 'series' && cat.id !== 'AllSeries');
  const sealedSeriesCategories = categories.filter(cat => cat.type === 'sealed_series');
  const setCategories = categories.filter(cat => cat.type === 'set');

  const rarityCategories = categories.filter(cat => cat.type === 'rarity');
  const psaGradeCategories = categories.filter(cat => cat.type === 'psa_grade');
  const extraCategories = categories.filter(cat => cat.type === 'extra');

  const isAllSelected = categories.find(cat => cat.id === 'all')?.checked;
  const isCardsSelected = categories.find(cat => cat.id === 'cards')?.checked;
  const isSealedSelected = categories.find(cat => cat.id === 'sealed')?.checked;

  const toggleSeriesExpansion = (seriesId: string) => {
    setExpandedSeries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(seriesId)) {
        newSet.delete(seriesId);
      } else {
        newSet.add(seriesId);
      }
      return newSet;
    });
  };

  return (
    <div className="w-full max-w-screen mx-auto bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white my-4 rounded-lg p-4 shadow-lg shadow-zinc-700">
      <h2 className="text-xl font-bold mb-4">Categories</h2>

      {/* Product Type Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Product Type</h3>
        <div className="space-y-2">
          {productCategories.map((category) => (
            <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={category.checked}
                onChange={() => onCategoryChange(category.id)}
                className="form-checkbox text-purple-600 rounded border-gray-400 focus:ring-purple-500"
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Card Categories (only shown when cards are selected and all is not selected) */}
      {isCardsSelected && !isAllSelected && (
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="psa">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline cursor-pointer">
              PSA Grade
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                {psaGradeCategories.map((category) => (
                  <label key={category.id} className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={category.checked}
                      onChange={() => onCategoryChange(category.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1 flex-shrink-0"
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>



          <AccordionItem value="series">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline cursor-pointer">
              Series
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {/* All Series option */}
                {(() => {
                  const allSeriesCategory = categories.find(cat => cat.id === 'AllSeries');
                  return allSeriesCategory ? (
                    <div className="border-l-2 border-gray-600 pl-3 mb-3">
                      <label className="flex items-start space-x-2 cursor-pointer hover:bg-purple-900/30 hover:bg-opacity-60 rounded px-2 py-1 transition-all duration-200">
                        <input
                          type="checkbox"
                          checked={allSeriesCategory.checked}
                          onChange={() => onCategoryChange(allSeriesCategory.id)}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 mt-1 flex-shrink-0"
                        />
                        <span className="text-sm text-purple-200 font-semibold hover:text-purple-100 transition-colors duration-200">{allSeriesCategory.name}</span>
                        {/* Green checkmark for All Series when active */}
                        {allSeriesCategory.checked && (
                          <div className="ml-auto flex items-center">
                            <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-400/30">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </label>
                    </div>
                  ) : null;
                })()}
                
                {seriesCategories.map((seriesCategory) => {
                  // Get sets that belong to this series
                  const setsInSeries = setCategories.filter(setCat => 
                    setCat.parentSeriesId === seriesCategory.id
                  );
                  
                  return (
                    <div key={seriesCategory.id} className="border-l-2 border-gray-500 pl-3">
                      <div className="flex items-center justify-between">
                        <label 
                          className="flex items-start space-x-2 cursor-pointer flex-1 hover:bg-blue-900/30 hover:bg-opacity-60 rounded px-2 py-1 transition-all duration-200"
                          onClick={(e) => {
                            // If there are sets to expand, toggle expansion
                            if (setsInSeries.length > 0) {
                              e.preventDefault();
                              toggleSeriesExpansion(seriesCategory.id);
                            }
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={seriesCategory.checked}
                            onChange={() => onCategoryChange(seriesCategory.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1 flex-shrink-0"
                          />
                          <span className="text-sm text-blue-100 font-semibold hover:text-blue-50 transition-colors duration-200">{seriesCategory.name}</span>
                        </label>
                        
                        {/* Chevron for series expansion - only show if there are sets */}
                        {setsInSeries.length > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleSeriesExpansion(seriesCategory.id);
                            }}
                            className="ml-2 p-1 text-gray-400 hover:text-white transition-colors"
                          >
                            <svg 
                              className={`w-4 h-4 transform transition-transform ${expandedSeries.has(seriesCategory.id) ? 'rotate-180' : ''}`}
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        )}
                      </div>
                      
                      {/* Show sets for this series ONLY when expanded */}
                      {expandedSeries.has(seriesCategory.id) && (
                        <div className="ml-6 mt-2 space-y-2">
                          <div className="text-xs text-purple-200 font-medium mb-2">Sets in this series:</div>
                          
                          {/* All Sets option */}
                          {(() => {
                            const allSetsCategory = setCategories.find(cat => cat.id === `${seriesCategory.id}:AllSets`);
                            return allSetsCategory ? (
                              <div className="border-l-2 border-gray-400 pl-3 mb-2">
                                <label className="flex items-start space-x-2 cursor-pointer hover:bg-blue-900/30 hover:bg-opacity-60 rounded px-2 py-1 transition-all duration-200">
                                  <input
                                    type="checkbox"
                                    checked={allSetsCategory.checked}
                                    onChange={() => onCategoryChange(allSetsCategory.id)}
                                    className="w-3 h-3 text-blue-600 rounded focus:ring-blue-500 mt-1 flex-shrink-0"
                                  />
                                  <span className="text-xs text-blue-200 font-semibold hover:text-blue-100 transition-colors duration-200">{allSetsCategory.name}</span>
                                </label>
                              </div>
                            ) : null;
                          })()}
                          
                          {setsInSeries.filter(set => !set.id.includes(':AllSets')).map((setCategory) => {
                            // Get rarities that belong to this set
                            const raritiesInSet = rarityCategories.filter(rarityCat => 
                              rarityCat.parentSetId === setCategory.id
                            );
                            
                            return (
                              <div key={setCategory.id} className="border-l-2 border-gray-300 pl-3">
                                <div className="flex items-center justify-between">
                                  <label 
                                    className="flex items-start space-x-2 cursor-pointer flex-1 hover:bg-cyan-900/30 hover:bg-opacity-60 rounded px-2 py-1 transition-all duration-200"
                                    onClick={(e) => {
                                      // If there are rarities to expand, toggle expansion
                                      if (raritiesInSet.length > 0) {
                                        e.preventDefault();
                                        // Toggle set expansion
                                        const setId = setCategory.id;
                                        if (expandedSeries.has(setId)) {
                                          setExpandedSeries(prev => {
                                            const newSet = new Set(prev);
                                            newSet.delete(setId);
                                            return newSet;
                                          });
                                        } else {
                                          setExpandedSeries(prev => {
                                            const newSet = new Set(prev);
                                            newSet.add(setId);
                                            return newSet;
                                          });
                                        }
                                      }
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={setCategory.checked}
                                      onChange={() => onCategoryChange(setCategory.id)}
                                      onClick={(e) => e.stopPropagation()}
                                                                                className="w-3 h-3 text-cyan-600 rounded focus:ring-cyan-500 mt-1 flex-shrink-0"
                                    />
                                    <span className="text-xs text-cyan-100 hover:text-cyan-50 transition-colors duration-200">{setCategory.name}</span>
                                  </label>
                                  
                                  {/* Chevron for set expansion */}
                                  {raritiesInSet.length > 0 && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        // Toggle set expansion
                                        const setId = setCategory.id;
                                        if (expandedSeries.has(setId)) {
                                          setExpandedSeries(prev => {
                                            const newSet = new Set(prev);
                                            newSet.delete(setId);
                                            return newSet;
                                          });
                                        } else {
                                          setExpandedSeries(prev => {
                                            const newSet = new Set(prev);
                                            newSet.add(setId);
                                            return newSet;
                                          });
                                        }
                                      }}
                                      className="ml-2 p-1 text-gray-400 hover:text-white transition-colors"
                                    >
                                      <svg 
                                        className={`w-4 h-4 transform transition-transform ${expandedSeries.has(setCategory.id) ? 'rotate-180' : ''}`}
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                                
                                {/* Show rarities for this set ONLY when expanded */}
                                {expandedSeries.has(setCategory.id) && raritiesInSet.length > 0 && (
                                  <div className="ml-4 mt-2 space-y-1">
                                    <div className="text-xs text-pink-200 font-medium mb-1">Rarities in this set:</div>
                                    
                                    {/* All Rarities indicator - shows green circle when active */}
                                    {(() => {
                                      const allRaritiesCategory = rarityCategories.find(cat => cat.id === `${setCategory.id}:AllRarities`);
                                      if (!allRaritiesCategory) return null;
                                      
                                      // Check if this set has only one rarity
                                      const raritiesInThisSet = rarityCategories.filter(cat => 
                                        cat.type === 'rarity' && 
                                        cat.parentSetId === setCategory.id && 
                                        !cat.id.includes(':AllRarities')
                                      );
                                      
                                      const hasOnlyOneRarity = raritiesInThisSet.length === 1;
                                      const singleRarity = hasOnlyOneRarity ? raritiesInThisSet[0] : null;
                                      
                                      // Check if the parent set is actually active (either checked directly or via "All Sets")
                                      const parentSeriesId = setCategory.parentSeriesId;
                                      const allSetsCategory = setCategories.find(cat => cat.id === `${parentSeriesId}:AllSets`);
                                      const isParentSetActive = setCategory.checked || (allSetsCategory && allSetsCategory.checked);
                                      
                                      // For single rarity sets: show green if either "All Rarities" is checked OR the single rarity is checked
                                      // For multiple rarity sets: show green only if "All Rarities" is checked
                                      // BUT only if the parent set is actually active
                                      const shouldShowGreen = isParentSetActive && (hasOnlyOneRarity 
                                        ? (allRaritiesCategory.checked || (singleRarity && singleRarity.checked))
                                        : allRaritiesCategory.checked);
                                      
                                      return (
                                        <div className="flex items-center space-x-2">
                                          {shouldShowGreen ? (
                                            <div className="w-3 h-3 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-400/30">
                                              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                              </svg>
                                            </div>
                                          ) : (
                                            <div className="w-3 h-3 bg-gray-500 rounded-full flex-shrink-0"></div>
                                          )}
                                          <span className="text-xs text-green-300 font-medium">{allRaritiesCategory.name}</span>
                                        </div>
                                      );
                                    })()}
                                    
                                    {raritiesInSet.filter(rarity => !rarity.id.includes(':AllRarities')).map((rarityCategory) => (
                                      <label key={rarityCategory.id} className="flex items-start space-x-2 cursor-pointer hover:bg-blue-900/30 hover:bg-opacity-60 rounded px-2 py-1 transition-all duration-200">
                                        <input
                                          type="checkbox"
                                          checked={rarityCategory.checked}
                                          onChange={() => onCategoryChange(rarityCategory.id)}
                                          className="w-2 h-2 text-blue-500 rounded focus:ring-blue-400 mt-1 flex-shrink-0"
                                        />
                                        <span className="text-xs text-blue-200 hover:text-blue-100 transition-colors duration-200">{rarityCategory.name}</span>
                                      </label>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>



          <AccordionItem value="energy">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline cursor-pointer">
              Energy Types
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                {energyCategories.map((category) => (
                  <label key={category.id} className="flex items-center space-x-2 cursor-pointer hover:bg-blue-900/20 hover:bg-opacity-50 rounded px-2 py-1 transition-all duration-200">
                    <input
                      type="checkbox"
                      checked={category.checked}
                      onChange={() => onCategoryChange(category.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 flex-shrink-0"
                    />
                    <span className="text-sm flex items-center gap-2 hover:text-white transition-colors duration-200">
                      {category.image && (
                        <Image 
                          src={category.image} 
                          alt={category.name} 
                          width={20} 
                          height={20}
                          className="w-5 h-5 object-contain flex-shrink-0"
                        />
                      )}
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rarities">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline cursor-pointer">
              Other Rarities
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                {/* All Other Rarities option */}
                {(() => {
                  const allExtraCategory = categories.find(cat => cat.id === 'AllExtra');
                  return allExtraCategory ? (
                    <label key={allExtraCategory.id} className="flex items-center space-x-2 cursor-pointer hover:bg-blue-900/20 hover:bg-opacity-50 rounded px-2 py-1 transition-all duration-200">
                      <input
                        type="checkbox"
                        checked={allExtraCategory.checked}
                        onChange={() => onCategoryChange(allExtraCategory.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 flex-shrink-0"
                      />
                      <span className="text-sm flex items-center gap-2 hover:text-white transition-colors duration-200">{allExtraCategory.name}</span>
                    </label>
                  ) : null;
                })()}
                
                {/* Individual other rarities */}
                {(() => {
                  const individualExtraCategories = extraCategories.filter(category => category.id !== 'AllExtra');
                  console.log('🔍 DEBUG: Individual extra categories:', individualExtraCategories);
                  return individualExtraCategories.map((category) => (
                    <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={category.checked}
                        onChange={() => onCategoryChange(category.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1 flex-shrink-0"
                      />
                      <span className="text-sm">{category.name}</span>
                    </label>
                  ));
                })()}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Sealed Product Categories (only shown when sealed products are selected and all is not selected) */}
      {isSealedSelected && !isAllSelected && (
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="product-type">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline cursor-pointer">
              Product Types
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                {sealedTypeCategories.map((category) => (
                  <label key={category.id} className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={category.checked}
                      onChange={() => onCategoryChange(category.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1 flex-shrink-0"
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="series">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline cursor-pointer">
              Series
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                {/* Show sealed product series */}
                {sealedSeriesCategories.map((category) => (
                  <label key={category.id} className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={category.checked}
                      onChange={() => onCategoryChange(category.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1 flex-shrink-0"
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
            </AccordionItem>


        </Accordion>
      )}
    </div>
  );
} 