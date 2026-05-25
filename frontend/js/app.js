const API_URL = '/api/tasks';

const form = document.getElementById('task-form');
const taskIdInput = document.getElementById('task-id');
const tituloInput = document.getElementById('titulo');
const descricaoInput = document.getElementById('descricao');
const responsavelInput = document.getElementById('responsavel');
const prazoInput = document.getElementById('prazo');
const statusInput = document.getElementById('status');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-titulo');
const taskList = document.getElementById('task-list');
const filterStatus = document.getElementById('filter-status');
const totalCount = document.getElementById('total-count');
const pendingCount = document.getElementById('pending-count');
const progressCount = document.getElementById('progress-count');
const completeCount = document.getElementById('complete-count');

async function fetchTasks() {
  const status = filterStatus.value;
  const url = status ? `${API_URL}?status=${encodeURIComponent(status)}` : API_URL;
  taskList.innerHTML = '<li class="empty loading">Carregando tarefas...</li>';

  try {
    const res = await fetch(url);
    if (!res.ok) {
      updateCounters([]);
      taskList.innerHTML = '<li class="empty">Erro ao carregar tarefas.</li>';
      return;
    }
    const tasks = await res.json();
    renderTasks(tasks);
  } catch (error) {
    updateCounters([]);
    taskList.innerHTML = '<li class="empty">Erro ao carregar tarefas.</li>';
  }
}

function renderTasks(tasks) {
  updateCounters(tasks);
  if (tasks.length === 0) {
    taskList.innerHTML = '<li class="empty">Nenhuma tarefa cadastrada.</li>';
    return;
  }
  taskList.innerHTML = tasks.map((t) => {
    const badgeClass = (t.status || 'pendente').replace(' ', '-');
    const prazo = t.prazo ? new Date(t.prazo).toLocaleDateString('pt-BR') : 'Sem prazo';
    return `
      <li class="task-item" data-id="${t.id}">
        <div>
          <span class="badge ${badgeClass}">${t.status || 'pendente'}</span>
        </div>
        <h3>${escapeHtml(t.titulo)}</h3>
        ${t.descricao ? `<p>${escapeHtml(t.descricao)}</p>` : ''}
        <div class="task-meta">
          <span>Responsavel: ${escapeHtml(t.responsavel || '-')}</span>
          <span>Prazo: ${prazo}</span>
        </div>
        <div class="task-actions">
          <button class="edit" data-id="${t.id}">Editar</button>
          <button class="danger delete" data-id="${t.id}">Excluir</button>
        </div>
      </li>
    `;
  }).join('');
}

function updateCounters(tasks) {
  totalCount.textContent = tasks.length;
  pendingCount.textContent = tasks.filter((task) => task.status === 'pendente').length;
  progressCount.textContent = tasks.filter((task) => task.status === 'em andamento').length;
  completeCount.textContent = tasks.filter((task) => task.status === 'concluida').length;
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = taskIdInput.value;
  const payload = {
    titulo: tituloInput.value.trim(),
    descricao: descricaoInput.value.trim() || null,
    responsavel: responsavelInput.value.trim() || null,
    prazo: prazoInput.value || null,
    status: statusInput.value,
  };

  const url = id ? `${API_URL}/${id}` : API_URL;
  const method = id ? 'PUT' : 'POST';
  submitBtn.disabled = true;
  submitBtn.textContent = id ? 'Atualizando...' : 'Salvando...';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert('Erro ao salvar tarefa.');
      return;
    }
    resetForm();
    fetchTasks();
  } catch (error) {
    alert('Erro ao salvar tarefa.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = taskIdInput.value ? 'Atualizar' : 'Salvar tarefa';
  }
});

cancelBtn.addEventListener('click', resetForm);

filterStatus.addEventListener('change', fetchTasks);

taskList.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;
  if (e.target.classList.contains('delete')) {
    if (!confirm('Excluir esta tarefa?')) return;
    const button = e.target;
    button.disabled = true;
    button.textContent = 'Excluindo...';
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        alert('Erro ao excluir tarefa.');
        return;
      }
      fetchTasks();
    } catch (error) {
      alert('Erro ao excluir tarefa.');
    } finally {
      if (button.isConnected) {
        button.disabled = false;
        button.textContent = 'Excluir';
      }
    }
  } else if (e.target.classList.contains('edit')) {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) return;
    const t = await res.json();
    taskIdInput.value = t.id;
    tituloInput.value = t.titulo || '';
    descricaoInput.value = t.descricao || '';
    responsavelInput.value = t.responsavel || '';
    prazoInput.value = t.prazo ? t.prazo.split('T')[0] : '';
    statusInput.value = t.status || 'pendente';
    formTitle.textContent = 'Editar tarefa';
    submitBtn.textContent = 'Atualizar';
    cancelBtn.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

function resetForm() {
  form.reset();
  taskIdInput.value = '';
  formTitle.textContent = 'Nova tarefa';
  submitBtn.textContent = 'Salvar tarefa';
  cancelBtn.hidden = true;
}

fetchTasks();
