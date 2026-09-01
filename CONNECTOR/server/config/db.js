import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class Collection {
  constructor(name) {
    this.name = name;
    this.filePath = path.join(DATA_DIR, `${name}.json`);
    this._ensureFile();
  }

  _ensureFile() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]), 'utf-8');
    }
  }

  async _read() {
    try {
      this._ensureFile();
      const content = await fs.promises.readFile(this.filePath, 'utf-8');
      if (!content || !content.trim()) return [];
      return JSON.parse(content);
    } catch (e) {
      console.error(`Error reading ${this.name}.json:`, e);
      return [];
    }
  }

  async _write(data) {
    try {
      await fs.promises.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error(`Error writing ${this.name}.json:`, e);
    }
  }

  async find(query = {}) {
    const items = await this._read();
    if (Object.keys(query).length === 0) return items;
    return items.filter(item => this._matches(item, query));
  }

  async findOne(query = {}) {
    const items = await this._read();
    return items.find(item => this._matches(item, query)) || null;
  }

  async findById(id) {
    const items = await this._read();
    return items.find(item => item.id === id || item._id === id) || null;
  }

  async insertOne(doc) {
    const items = await this._read();
    const newDoc = {
      id: doc.id || doc._id || `${this.name.slice(0, 3)}-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    };
    items.push(newDoc);
    await this._write(items);
    return newDoc;
  }

  async updateOne(query, updateData) {
    const items = await this._read();
    const index = items.findIndex(item => this._matches(item, query));
    if (index === -1) return null;

    const existing = items[index];
    let updated;

    if (updateData.$set) {
      updated = { ...existing, ...updateData.$set, updatedAt: new Date().toISOString() };
    } else if (updateData.$push) {
      updated = { ...existing, updatedAt: new Date().toISOString() };
      for (const [key, val] of Object.entries(updateData.$push)) {
        updated[key] = [...(updated[key] || []), val];
      }
    } else if (updateData.$pull) {
      updated = { ...existing, updatedAt: new Date().toISOString() };
      for (const [key, val] of Object.entries(updateData.$pull)) {
        if (typeof val === 'object') {
          updated[key] = (updated[key] || []).filter(item => !this._matches(item, val));
        } else {
          updated[key] = (updated[key] || []).filter(item => item !== val);
        }
      }
    } else {
      updated = { ...existing, ...updateData, updatedAt: new Date().toISOString() };
    }

    items[index] = updated;
    await this._write(items);
    return updated;
  }

  async updateById(id, updateData) {
    return this.updateOne({ id }, updateData);
  }

  async deleteOne(query) {
    const items = await this._read();
    const index = items.findIndex(item => this._matches(item, query));
    if (index === -1) return false;
    items.splice(index, 1);
    await this._write(items);
    return true;
  }

  async deleteById(id) {
    return this.deleteOne({ id });
  }

  async count(query = {}) {
    const items = await this.find(query);
    return items.length;
  }

  async clear() {
    await this._write([]);
  }

  _matches(item, query) {
    for (const [key, val] of Object.entries(query)) {
      if (val !== undefined) {
        if (Array.isArray(val) && Array.isArray(item[key])) {
          if (val.length !== item[key].length || !val.every((v, i) => v === item[key][i])) {
            return false;
          }
        } else if (item[key] !== val) {
          return false;
        }
      }
    }
    return true;
  }
}

export const db = {
  users: new Collection('users'),
  posts: new Collection('posts'),
  projects: new Collection('projects'),
  projectInterests: new Collection('projectInterests'),
  projectDiscussions: new Collection('projectDiscussions'),
  opportunities: new Collection('opportunities'),
  opportunityCommunities: new Collection('opportunityCommunities'),
  communityMessages: new Collection('communityMessages'),
  applications: new Collection('applications'),
  connectionRequests: new Collection('connectionRequests'),
  connections: new Collection('connections'),
  conversations: new Collection('conversations'),
  messages: new Collection('messages'),
  notifications: new Collection('notifications'),

  async resetAll() {
    await this.users.clear();
    await this.posts.clear();
    await this.projects.clear();
    await this.projectInterests.clear();
    await this.projectDiscussions.clear();
    await this.opportunities.clear();
    await this.opportunityCommunities.clear();
    await this.communityMessages.clear();
    await this.applications.clear();
    await this.connectionRequests.clear();
    await this.connections.clear();
    await this.conversations.clear();
    await this.messages.clear();
    await this.notifications.clear();
    console.log('Database has been completely cleared. 0 records across all collections.');
  }
};
