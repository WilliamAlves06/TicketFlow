// Quick debug logs to confirm the script is being loaded
console.log('scripts.js loaded');
window.addEventListener('error', function (e) {
    console.error('Global JS error:', e.message, e.error || e.filename + ':' + e.lineno);
});

const mockOrders = [
            {
                id: "OS-001",
                title: "Manutenção Preventiva - Ar Condicionado",
                client: "Empresa ABC Ltda",
                technician: "João Silva",
                status: "in-progress",
                priority: "high",
                createdAt: "2024-01-15",
                description: "Limpeza e verificação do sistema de ar condicionado"
            },
            {
                id: "OS-002",
                title: "Reparo Elétrico - Quadro Principal",
                client: "Indústria XYZ",
                technician: "Maria Santos",
                status: "pending",
                priority: "medium",
                createdAt: "2024-01-14",
                description: "Verificação e reparo do quadro elétrico principal"
            },
            {
                id: "OS-003",
                title: "Instalação de Equipamento",
                client: "Comércio 123",
                technician: "Pedro Costa",
                status: "completed",
                priority: "low",
                createdAt: "2024-01-13",
                description: "Instalação de novo equipamento de segurança"
            }
        ];

        const statusConfig = {
            pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800", icon: "clock" },
            "in-progress": { label: "Em Andamento", color: "bg-blue-100 text-blue-800", icon: "alert-circle" },
            completed: { label: "Concluída", color: "bg-green-100 text-green-800", icon: "check-circle" },
            cancelled: { label: "Cancelada", color: "bg-red-100 text-red-800", icon: "x-circle" }
        };

        const priorityConfig = {
            low: { label: "Baixa", color: "bg-gray-100 text-gray-800" },
            medium: { label: "Média", color: "bg-orange-100 text-orange-800" },
            high: { label: "Alta", color: "bg-red-100 text-red-800" }
        };

        let orders = [...mockOrders];

        function renderOrders(ordersToRender = orders) {
            const container = document.getElementById('orders-container');
            const emptyState = document.getElementById('empty-state');
            
            if (ordersToRender.length === 0) {
                container.innerHTML = '';
                emptyState.classList.remove('hidden');
                return;
            }
            
            emptyState.classList.add('hidden');
            
            container.innerHTML = ordersToRender.map(order => {
                const statusInfo = statusConfig[order.status];
                const priorityInfo = priorityConfig[order.priority];
                const date = new Date(order.createdAt).toLocaleDateString('pt-BR');
                
                return `
                    <div class="rounded-lg border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                        <div class="p-6">
                            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div class="flex-1">
                                    <div class="flex items-center gap-3 mb-2">
                                        <h3 class="font-semibold text-lg font-space-grotesk">${order.title}</h3>
                                        <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">${order.id}</span>
                                    </div>
                                    
                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                        <div class="flex items-center gap-2">
                                            <i data-lucide="user" class="h-4 w-4"></i>
                                            <span>Cliente: ${order.client}</span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <i data-lucide="user" class="h-4 w-4"></i>
                                            <span>Técnico: ${order.technician}</span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <i data-lucide="calendar" class="h-4 w-4"></i>
                                            <span>Criada em: ${date}</span>
                                        </div>
                                    </div>
                                    
                                    <p class="text-sm text-muted-foreground mt-2">${order.description}</p>
                                </div>
                                
                                <div class="flex flex-col md:items-end gap-3">
                                    <div class="flex gap-2">
                                        <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusInfo.color}">
                                            <i data-lucide="${statusInfo.icon}" class="h-3 w-3 mr-1"></i>
                                            ${statusInfo.label}
                                        </span>
                                        <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityInfo.color}">
                                            ${priorityInfo.label}
                                        </span>
                                    </div>
                                    
                                    <div class="flex gap-2">
                                        <button class="inline-flex items-center justify-center rounded-md text-sm font-medium border border-border bg-background hover:bg-gray-50 h-8 px-3"><a href="/pages/view.html">
                                            Visualizar
                                        </a></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            
            // Re-initialize Lucide icons
            lucide.createIcons();
        }

        function filterOrders() {
            const searchTerm = document.getElementById('search-input').value.toLowerCase();
            const statusFilter = document.getElementById('status-filter').value;
            
            const filtered = orders.filter(order => {
                const matchesSearch = 
                    order.title.toLowerCase().includes(searchTerm) ||
                    order.client.toLowerCase().includes(searchTerm) ||
                    order.technician.toLowerCase().includes(searchTerm);
                const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
                return matchesSearch && matchesStatus;
            });
            
            renderOrders(filtered);
        }

        function updateStats() {
            const stats = {
                total: orders.length,
                pending: orders.filter(o => o.status === 'pending').length,
                inProgress: orders.filter(o => o.status === 'in-progress').length,
                completed: orders.filter(o => o.status === 'completed').length
            };
            
            document.getElementById('total-count').textContent = stats.total;
            document.getElementById('pending-count').textContent = stats.pending;
            document.getElementById('progress-count').textContent = stats.inProgress;
            document.getElementById('completed-count').textContent = stats.completed;
        }

        function openCreateModal() {
            document.getElementById('create-modal').classList.remove('hidden');
            document.getElementById('create-modal').classList.add('flex');
        }

        function closeCreateModal() {
            document.getElementById('create-modal').classList.add('hidden');
            document.getElementById('create-modal').classList.remove('flex');
            document.getElementById('create-form').reset();
        }

        // Load orders from backend API (fallback to mockOrders on failure)
        async function loadOrdersFromAPI() {
            try {
                const res = await fetch('/api/orders');
                if (!res.ok) throw new Error('Fetch failed ' + res.status);
                const data = await res.json();
                if (Array.isArray(data)) {
                    orders = data;
                } else if (Array.isArray(data.orders)) {
                    orders = data.orders;
                }
                renderOrders();
                updateStats();
                console.log('Orders loaded from API');
            } catch (err) {
                console.warn('Could not load orders from API, using mock data. Error:', err);
                orders = [...mockOrders];
                renderOrders();
                updateStats();
            }
        }

        async function createOrderAPI(orderPayload) {
            try {
                const res = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderPayload)
                });
                if (!res.ok) throw new Error('Create failed ' + res.status);
                const created = await res.json();
                return created;
            } catch (err) {
                console.error('Error creating order via API:', err);
                throw err;
            }
        }

        // DOM ready: wire UI and use API
        document.addEventListener('DOMContentLoaded', function() {
            try {
                // Input filters
                const searchEl = document.getElementById('search-input');
                const statusEl = document.getElementById('status-filter');
                const createForm = document.getElementById('create-form');
                const createModal = document.getElementById('create-modal');

                if (searchEl) searchEl.addEventListener('input', filterOrders);
                if (statusEl) statusEl.addEventListener('change', filterOrders);

                // Create form submission -> send to API
                if (createForm) createForm.addEventListener('submit', async function(e) {
                    e.preventDefault();

                    const orderPayload = {
                        title: document.getElementById('title').value,
                        client: document.getElementById('client').value,
                        technician: document.getElementById('technician').selectedOptions[0]?.text || '',
                        status: 'pending',
                        priority: document.getElementById('priority').value,
                        createdAt: new Date().toISOString().split('T')[0],
                        description: document.getElementById('description').value
                    };

                    try {
                        const created = await createOrderAPI(orderPayload);
                        // If API returned an object, use it. Otherwise fallback to payload with generated id
                        orders.unshift(created || Object.assign({ id: `OS-${String(orders.length + 1).padStart(3, '0')}` }, orderPayload));
                        updateStats();
                        renderOrders();
                        closeCreateModal();
                    } catch (err) {
                        // On API error, still add locally so user sees result
                        console.warn('API create failed — adding locally', err);
                        const fallback = Object.assign({ id: `OS-${String(orders.length + 1).padStart(3, '0')}` }, orderPayload);
                        orders.unshift(fallback);
                        updateStats();
                        renderOrders();
                        closeCreateModal();
                    }
                });

                // Close modal when clicking outside
                if (createModal) createModal.addEventListener('click', function(e) {
                    if (e.target === this) {
                        closeCreateModal();
                    }
                });

                // Initialize icons
                if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();

                // Load data from API
                loadOrdersFromAPI();
            } catch (err) {
                console.error('Initialization error:', err);
            }
        });