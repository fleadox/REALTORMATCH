import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Globe, Plus, Trash2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface SocialMediaLinksProps {
  links: SocialLink[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, url: string) => void;
  onReorder: (links: SocialLink[]) => void;
  isEditing?: boolean;
}

const platformIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  website: Globe,
};

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({
  links,
  onAdd,
  onRemove,
  onUpdate,
  onReorder,
  isEditing = false,
}) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium text-white">Social Media Links</h4>
        {isEditing && (
          <button
            type="button"
            onClick={onAdd}
            className="btn-ghost py-1 px-2"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Link
          </button>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="social-links">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {links.map((link, index) => {
                const Icon = platformIcons[link.platform as keyof typeof platformIcons] || Globe;
                
                return (
                  <Draggable
                    key={link.id}
                    draggableId={link.id}
                    index={index}
                    isDragDisabled={!isEditing}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="glass-panel-dark p-3 flex items-center gap-3"
                      >
                        <Icon className="w-5 h-5 text-gray-400" />
                        
                        {isEditing ? (
                          <div className="flex-1 flex items-center gap-2">
                            <select
                              value={link.platform}
                              onChange={(e) => onUpdate(link.id, e.target.value)}
                              className="input py-1 px-2"
                            >
                              <option value="facebook">Facebook</option>
                              <option value="twitter">Twitter</option>
                              <option value="instagram">Instagram</option>
                              <option value="linkedin">LinkedIn</option>
                              <option value="youtube">YouTube</option>
                              <option value="website">Website</option>
                            </select>
                            <input
                              type="url"
                              value={link.url}
                              onChange={(e) => onUpdate(link.id, e.target.value)}
                              className="input flex-1 py-1"
                              placeholder="https://"
                            />
                            <button
                              type="button"
                              onClick={() => onRemove(link.id)}
                              className="p-1 text-gray-400 hover:text-error-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-accent-300 hover:text-accent-400"
                          >
                            {link.url}
                          </a>
                        )}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default SocialMediaLinks;