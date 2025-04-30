import React, { useState } from 'react';
import { MapPin, Search, Plus, Trash2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { georgianRegions } from '../../utils/mockData';

interface ServiceArea {
  id: string;
  region: string;
  cities: string[];
}

interface ServiceAreasProps {
  areas: ServiceArea[];
  onAdd: (area: ServiceArea) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, area: Partial<ServiceArea>) => void;
  onReorder: (areas: ServiceArea[]) => void;
  isEditing?: boolean;
}

const ServiceAreas: React.FC<ServiceAreasProps> = ({
  areas,
  onAdd,
  onRemove,
  onUpdate,
  onReorder,
  isEditing = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(areas);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

  const handleAddArea = () => {
    onAdd({
      id: crypto.randomUUID(),
      region: '',
      cities: [],
    });
  };

  const filteredAreas = areas.filter(area =>
    area.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    area.cities.some(city => city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium text-white">Service Areas</h4>
        {isEditing && (
          <button
            type="button"
            onClick={handleAddArea}
            className="btn-ghost py-1 px-2"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Region
          </button>
        )}
      </div>

      {(isEditing || areas.length > 3) && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search regions and cities..."
            className="input pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="service-areas">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {filteredAreas.map((area, index) => (
                <Draggable
                  key={area.id}
                  draggableId={area.id}
                  index={index}
                  isDragDisabled={!isEditing}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="glass-panel-dark p-4"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        {isEditing ? (
                          <div className="flex-1 flex items-center gap-2">
                            <select
                              value={area.region}
                              onChange={(e) => onUpdate(area.id, { region: e.target.value })}
                              className="input py-1 px-2"
                            >
                              <option value="">Select Region</option>
                              {georgianRegions.map(region => (
                                <option key={region} value={region}>{region}</option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => onRemove(area.id)}
                              className="p-1 text-gray-400 hover:text-error-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-white font-medium">{area.region}</span>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="pl-8">
                          <input
                            type="text"
                            value={area.cities.join(', ')}
                            onChange={(e) => onUpdate(area.id, {
                              cities: e.target.value.split(',').map(city => city.trim())
                            })}
                            className="input py-1"
                            placeholder="Enter cities, separated by commas"
                          />
                        </div>
                      ) : area.cities.length > 0 && (
                        <div className="pl-8 flex flex-wrap gap-2">
                          {area.cities.map((city, i) => (
                            <span
                              key={i}
                              className="glass-panel px-2 py-1 text-sm text-gray-300"
                            >
                              {city}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ServiceAreas;