// Admin Panel JavaScript

class PortfolioAdmin {
  constructor() {
    this.currentUser = null;
    this.projects = [];
    this.editingProjectId = null;
    this.deleteProjectId = null;
    this.init();
  }

  async init() {
    // Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      this.currentUser = session.user;
      this.showAdminSection();
      await this.loadProjects();
    } else {
      this.showLoginSection();
    }

    // Setup event listeners
    this.setupEventListeners();
    
    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        this.currentUser = session.user;
        this.showAdminSection();
        this.loadProjects();
      } else {
        this.currentUser = null;
        this.showLoginSection();
      }
    });
  }

  setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.handleLogout());
    }

    // Add project button
    const addBtn = document.getElementById('add-project-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.openProjectModal());
    }

    // Project form
    const projectForm = document.getElementById('project-form');
    if (projectForm) {
      projectForm.addEventListener('submit', (e) => this.handleProjectSubmit(e));
    }

    // Modal close buttons
    const modalClose = document.getElementById('modal-close');
    const deleteModalClose = document.getElementById('delete-modal-close');
    const modalCancel = document.getElementById('modal-cancel');
    const deleteCancel = document.getElementById('delete-cancel');
    const deleteConfirm = document.getElementById('delete-confirm');

    if (modalClose) modalClose.addEventListener('click', () => this.closeProjectModal());
    if (deleteModalClose) deleteModalClose.addEventListener('click', () => this.closeDeleteModal());
    if (modalCancel) modalCancel.addEventListener('click', () => this.closeProjectModal());
    if (deleteCancel) deleteCancel.addEventListener('click', () => this.closeDeleteModal());
    if (deleteConfirm) deleteConfirm.addEventListener('click', () => this.confirmDelete());

    // Close modal on backdrop click
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    });
  }

  showLoginSection() {
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('admin-section').classList.add('hidden');
  }

  showAdminSection() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('admin-section').classList.remove('hidden');
  }

  async handleLogin(e) {
    e.preventDefault();
    const errorDiv = document.getElementById('login-error');
    errorDiv.textContent = '';
    errorDiv.classList.remove('show');

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      errorDiv.textContent = error.message;
      errorDiv.classList.add('show');
    } else {
      this.currentUser = data.user;
      this.showAdminSection();
      await this.loadProjects();
    }
  }

  async handleLogout() {
    await supabase.auth.signOut();
    this.currentUser = null;
    this.showLoginSection();
  }

  async loadProjects() {
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '<div class="loading">Loading projects...</div>';

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      projectsList.innerHTML = `<div class="error-message show">Error loading projects: ${error.message}</div>`;
      console.error('Error loading projects:', error);
      return;
    }

    this.projects = data || [];

    if (this.projects.length === 0) {
      projectsList.innerHTML = `
        <div class="empty-state">
          <h3>No projects yet</h3>
          <p>Click "Add Project" to create your first project.</p>
        </div>
      `;
      return;
    }

    projectsList.innerHTML = this.projects.map(project => this.renderProjectCard(project)).join('');
    
    // Attach event listeners to action buttons
    this.attachProjectEventListeners();
  }

  renderProjectCard(project) {
    const badges = [];
    if (project.featured) badges.push('<span class="badge">Featured</span>');
    if (project.confidential) badges.push('<span class="badge">Confidential</span>');
    if (project.macos_window) badges.push('<span class="badge">macOS Style</span>');
    if (project.classification) badges.push(`<span class="badge">${this.escapeHtml(project.classification)}</span>`);

    return `
      <div class="project-card-admin" data-project-id="${project.id}">
        <img src="${this.escapeHtml(project.image)}" alt="${this.escapeHtml(project.title)}" class="project-card-image">
        <div class="project-card-content">
          <h3 class="project-card-title">${this.escapeHtml(project.title)}</h3>
          <p class="project-card-description">${this.escapeHtml(project.description)}</p>
          <div class="project-card-badges">
            ${badges.join('')}
          </div>
          <div class="project-card-actions">
            <button class="btn btn-secondary edit-project" data-id="${project.id}">Edit</button>
            <button class="btn btn-danger delete-project" data-id="${project.id}">Delete</button>
          </div>
        </div>
      </div>
    `;
  }

  attachProjectEventListeners() {
    // Edit buttons
    document.querySelectorAll('.edit-project').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projectId = e.target.dataset.id;
        this.editProject(projectId);
      });
    });

    // Delete buttons
    document.querySelectorAll('.delete-project').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projectId = e.target.dataset.id;
        this.openDeleteModal(projectId);
      });
    });
  }

  openProjectModal(projectId = null) {
    this.editingProjectId = projectId;
    const modal = document.getElementById('project-modal');
    const form = document.getElementById('project-form');
    const modalTitle = document.getElementById('modal-title');

    if (projectId) {
      const project = this.projects.find(p => p.id === projectId);
      if (project) {
        modalTitle.textContent = 'Edit Project';
        this.populateProjectForm(project);
      }
    } else {
      modalTitle.textContent = 'Add Project';
      form.reset();
      document.getElementById('project-id').value = '';
    }

    modal.classList.remove('hidden');
  }

  closeProjectModal() {
    document.getElementById('project-modal').classList.add('hidden');
    document.getElementById('project-form').reset();
    this.editingProjectId = null;
  }

  populateProjectForm(project) {
    document.getElementById('project-id').value = project.id;
    document.getElementById('project-title').value = project.title || '';
    document.getElementById('project-description').value = project.description || '';
    document.getElementById('project-image').value = project.image || '';
    document.getElementById('project-github').value = project.github || '';
    document.getElementById('project-demo').value = project.demo || '';
    document.getElementById('project-technologies').value = (project.technologies || []).join(', ');
    document.getElementById('project-roles').value = (project.roles || []).join(', ');
    document.getElementById('project-classification').value = project.classification || '';
    document.getElementById('project-status').value = project.development_status || '';
    document.getElementById('project-timeline').value = project.development_timeline || '';
    document.getElementById('project-order').value = project.display_order || 0;
    document.getElementById('project-featured').checked = project.featured || false;
    document.getElementById('project-confidential').checked = project.confidential || false;
    document.getElementById('project-macos-window').checked = project.macos_window || false;
  }

  async handleProjectSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const projectData = {
      title: formData.get('title'),
      description: formData.get('description'),
      image: formData.get('image'),
      github: formData.get('github') || null,
      demo: formData.get('demo') || null,
      technologies: formData.get('technologies').split(',').map(t => t.trim()).filter(t => t),
      roles: formData.get('roles') ? formData.get('roles').split(',').map(r => r.trim()).filter(r => r) : [],
      classification: formData.get('classification') || null,
      development_status: formData.get('status') || null,
      development_timeline: formData.get('timeline') || null,
      display_order: parseInt(formData.get('order')) || 0,
      featured: formData.get('featured') === 'on',
      confidential: formData.get('confidential') === 'on',
      macos_window: formData.get('macosWindow') === 'on',
      active: true,
    };

    const projectId = formData.get('project-id');
    let result;

    if (projectId) {
      // Update existing project
      const { data, error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', projectId)
        .select();

      if (error) {
        alert(`Error updating project: ${error.message}`);
        return;
      }
      result = data[0];
    } else {
      // Create new project
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select();

      if (error) {
        alert(`Error creating project: ${error.message}`);
        return;
      }
      result = data[0];
    }

    this.closeProjectModal();
    await this.loadProjects();
  }

  editProject(projectId) {
    this.openProjectModal(projectId);
  }

  openDeleteModal(projectId) {
    this.deleteProjectId = projectId;
    const project = this.projects.find(p => p.id === projectId);
    if (project) {
      document.querySelector('.delete-project-name').textContent = project.title;
    }
    document.getElementById('delete-modal').classList.remove('hidden');
  }

  closeDeleteModal() {
    document.getElementById('delete-modal').classList.add('hidden');
    this.deleteProjectId = null;
  }

  async confirmDelete() {
    if (!this.deleteProjectId) return;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', this.deleteProjectId);

    if (error) {
      alert(`Error deleting project: ${error.message}`);
      return;
    }

    this.closeDeleteModal();
    await this.loadProjects();
  }

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize admin panel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.admin = new PortfolioAdmin();
});

