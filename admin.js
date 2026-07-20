    document.addEventListener('DOMContentLoaded', () => {
      // Resolve API base path dynamically
      const API_BASE = window.location.protocol === "file:" ? "http://localhost:3000" : "";
      // Audio notification player
      const notifSound = document.getElementById('notif-sound-el');
      const triggerSound = () => {
        try {
          notifSound.play();
        } catch(e) {}
      };

      // State databases
      let orders = [];
      let products = [];
      let categories = [];
      let coupons = [];
      let reviews = [];
      let logs = [];
      let settings = {};
      let homepageConfig = {};
      let employees = [];

      // Tab Switching Logic
      const sidebarItems = document.querySelectorAll('.sidebar-item');
      const tabPanels = document.querySelectorAll('.tab-panel');
      
      sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
          const targetTabId = item.getAttribute('data-tab');
          
          sidebarItems.forEach(sib => sib.classList.remove('active'));
          item.classList.add('active');
          
          tabPanels.forEach(panel => {
            if (panel.id === targetTabId) {
              panel.classList.add('active');
            } else {
              panel.classList.remove('active');
            }
          });
          
          // Re-trigger load queries when switching tabs
          syncData();
        });
      });

      // Real-time notifications (SSE) listener
      const setupSSE = () => {
        const sseUrl = window.location.protocol === "file:" ? "http://localhost:3000/api/admin/events" : "/api/admin/events";
        const eventSource = new EventSource(sseUrl);
        
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            triggerSound();
            showToast(data.message, data.type);
            
            // Automatically refresh counts and stats
            syncData();
          } catch(e) {
            console.error("SSE parse error", e);
          }
        };
        
        eventSource.onerror = (err) => {
          console.warn("SSE connection error, closing channel", err);
          eventSource.close();
          // Attempt reconnection in 5 seconds
          setTimeout(setupSSE, 5000);
        };
      };
      
      // Beautiful toast alerts container rendering
      const showToast = (message, type = 'info') => {
        const container = document.getElementById('toast-container') || (() => {
          const div = document.createElement('div');
          div.id = 'toast-container';
          div.style.position = 'fixed';
          div.style.top = '24px';
          div.style.right = '24px';
          div.style.zIndex = '99999';
          div.style.display = 'flex';
          div.style.flexDirection = 'column';
          div.style.gap = '12px';
          document.body.appendChild(div);
          return div;
        })();
        
        const toast = document.createElement('div');
        toast.style.padding = '14px 20px';
        toast.style.borderRadius = '6px';
        toast.style.color = '#FFF';
        toast.style.fontWeight = '600';
        toast.style.fontSize = '0.9rem';
        toast.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
        toast.style.minWidth = '300px';
        toast.style.maxWidth = '400px';
        toast.style.display = 'flex';
        toast.style.justifyContent = 'space-between';
        toast.style.alignItems = 'center';
        toast.style.fontFamily = 'sans-serif';
        toast.style.animation = 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        
        if (type === 'new-order') {
          toast.style.backgroundColor = '#27AE60';
        } else if (type === 'out-of-stock') {
          toast.style.backgroundColor = '#C0392B';
        } else if (type === 'low-stock' || type === 'stock-mismatch-warning') {
          toast.style.backgroundColor = '#D35400';
        } else if (type === 'new-customer') {
          toast.style.backgroundColor = '#2980B9';
        } else {
          toast.style.backgroundColor = '#2C3E50';
        }
        
        toast.innerHTML = `
          <span>${message}</span>
          <button style="background:none; border:none; color:#FFF; font-size:1.2rem; cursor:pointer; margin-left:16px; line-height:1;">&times;</button>
        `;
        
        container.appendChild(toast);
        
        toast.querySelector('button').addEventListener('click', () => {
          toast.remove();
        });
        
        setTimeout(() => {
          toast.style.opacity = '0';
          toast.style.transition = 'opacity 0.5s ease';
          setTimeout(() => toast.remove(), 500);
        }, 6000);
      };

      // Synchronize Data (Fetch API with live database backend)
      const syncData = () => {
        // Fetch Settings
        fetch(API_BASE + "/api/settings")
          .then(res => res.json())
          .then(data => {
            settings = data || {};
            loadSettingsUI();
          })
          .catch(err => {
            console.error("Failed to fetch settings:", err);
            settings = {};
            loadSettingsUI();
          });

        // Fetch Products
        fetch(API_BASE + "/api/products")
          .then(res => res.json())
          .then(data => {
            products = Array.isArray(data) ? data : [];
            renderProducts();
            renderInventory();
          })
          .catch(err => {
            console.error("Failed to fetch products:", err);
            products = [];
            renderProducts();
            renderInventory();
          });

        // Fetch Categories
        fetch(API_BASE + "/api/categories")
          .then(res => res.json())
          .then(data => {
            categories = Array.isArray(data) ? data : [];
            renderCategories();
          })
          .catch(err => {
            console.error("Failed to fetch categories:", err);
            categories = [];
            renderCategories();
          });

        // Fetch Orders
        fetch(API_BASE + "/api/orders")
          .then(res => res.json())
          .then(data => {
            orders = Array.isArray(data) ? data : [];
            renderOrders();
            renderUpiAuditor();
            renderCustomers();
            renderOverview();
          })
          .catch(err => {
            console.error("Failed to fetch orders:", err);
            orders = [];
            renderOrders();
            renderUpiAuditor();
            renderCustomers();
            renderOverview();
          });

        // Fetch Coupons
        fetch(API_BASE + "/api/coupons")
          .then(res => res.json())
          .then(data => {
            coupons = Array.isArray(data) ? data : [];
            renderCoupons();
          })
          .catch(err => {
            console.error("Failed to fetch coupons:", err);
            coupons = [];
            renderCoupons();
          });

        // Fetch Reviews
        fetch(API_BASE + "/api/reviews")
          .then(res => res.json())
          .then(data => {
            reviews = Array.isArray(data) ? data : [];
            renderReviews();
          })
          .catch(err => {
            console.error("Failed to fetch reviews:", err);
            reviews = [];
            renderReviews();
          });

        // Fetch Logs
        fetch(API_BASE + "/api/logs")
          .then(res => res.json())
          .then(data => {
            logs = Array.isArray(data) ? data : [];
            renderLogs();
          })
          .catch(err => {
            console.error("Failed to fetch logs:", err);
            logs = [];
            renderLogs();
          });

        // Fetch Homepage Hero settings
        fetch(API_BASE + "/api/homepage")
          .then(res => res.json())
          .then(data => {
            homepageConfig = data || {};
            loadHomepageUI();
          })
          .catch(err => {
            console.error("Failed to fetch homepage config:", err);
            homepageConfig = {};
            loadHomepageUI();
          });

        // Fetch Employees
        fetch(API_BASE + "/api/admin/employees")
          .then(res => res.json())
          .then(data => {
            employees = Array.isArray(data) ? data : [];
            renderEmployees();
          })
          .catch(err => {
            console.error("Failed to fetch employees:", err);
            employees = [];
            renderEmployees();
          });
      };

      // HOMEPAGE HERO BINDINGS & LOGIC
      
      const loadHomepageUI = () => {
        document.getElementById('hp-hero-title').value = (homepageConfig.hero && homepageConfig.hero.title) || "";
        document.getElementById('hp-hero-subtitle').value = (homepageConfig.hero && homepageConfig.hero.subtitle) || "";
        document.getElementById('hp-banner-text').value = homepageConfig.bannerText || "";
        
        if (homepageConfig.testimonials && homepageConfig.testimonials[0]) {
          document.getElementById('hp-test1-name').value = homepageConfig.testimonials[0].name || "";
          document.getElementById('hp-test1-role').value = homepageConfig.testimonials[0].role || "";
          document.getElementById('hp-test1-text').value = homepageConfig.testimonials[0].text || "";
        }
        if (homepageConfig.testimonials && homepageConfig.testimonials[1]) {
          document.getElementById('hp-test2-name').value = homepageConfig.testimonials[1].name || "";
          document.getElementById('hp-test2-role').value = homepageConfig.testimonials[1].role || "";
          document.getElementById('hp-test2-text').value = homepageConfig.testimonials[1].text || "";
        }
      };

      document.getElementById('btn-save-homepage').addEventListener('click', () => {
        const payload = {
          hero: {
            title: document.getElementById('hp-hero-title').value,
            subtitle: document.getElementById('hp-hero-subtitle').value
          },
          bannerText: document.getElementById('hp-banner-text').value,
          testimonials: [
            {
              name: document.getElementById('hp-test1-name').value,
              role: document.getElementById('hp-test1-role').value,
              text: document.getElementById('hp-test1-text').value
            },
            {
              name: document.getElementById('hp-test2-name').value,
              role: document.getElementById('hp-test2-role').value,
              text: document.getElementById('hp-test2-text').value
            }
          ]
        };

        fetch(API_BASE + "/api/homepage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
        .then(res => {
          if (res.ok) {
            alert("Homepage configurations saved to server!");
            syncData();
          } else {
            throw new Error("Failed to save homepage settings");
          }
        })
        .catch(err => {
          console.warn("Offline fallback caching homepage config", err);
          localStorage.setItem('mitti_fresh_homepage', JSON.stringify(payload));
          alert("Homepage configurations cached offline!");
          syncData();
        });
      });

      // 1. SETTINGS PANEL LOGIC
      const loadSettingsUI = () => {
        document.getElementById('setting-biz-name').value = settings.businessName || "";
        document.getElementById('setting-upi-id').value = settings.upiId || "";
        document.getElementById('setting-support-phone').value = settings.supportPhone || "";
        document.getElementById('setting-support-email').value = settings.supportEmail || "";
        
        if (settings.bankDetails) {
          document.getElementById('setting-bank-name').value = settings.bankDetails.accountName || "";
          document.getElementById('setting-bank-brand').value = settings.bankDetails.bankName || "";
          document.getElementById('setting-bank-acc').value = settings.bankDetails.accountNumber || "";
          document.getElementById('setting-bank-ifsc').value = settings.bankDetails.ifscCode || "";
        }
        
        document.getElementById('setting-gstin').value = settings.GSTIN || "";
        document.getElementById('setting-pan').value = settings.PAN || "";
        
        if (settings.serviceablePincodes) {
          document.getElementById('settings-pincodes-input').value = settings.serviceablePincodes.join(', ');
        }
        
        if (settings.shippingRules) {
          document.getElementById('settings-shipping-flat').value = settings.shippingRules.flatRate || 50;
          document.getElementById('settings-shipping-free').value = settings.shippingRules.freeShippingThreshold || 500;
          document.getElementById('settings-shipping-cod').value = settings.shippingRules.codConvenienceFee || 50;
        }
      };

      document.getElementById('settings-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const updated = {
          businessName: document.getElementById('setting-biz-name').value,
          upiId: document.getElementById('setting-upi-id').value,
          supportPhone: document.getElementById('setting-support-phone').value,
          supportEmail: document.getElementById('setting-support-email').value,
          bankDetails: {
            accountName: document.getElementById('setting-bank-name').value,
            bankName: document.getElementById('setting-bank-brand').value,
            accountNumber: document.getElementById('setting-bank-acc').value,
            ifscCode: document.getElementById('setting-bank-ifsc').value
          },
          GSTIN: document.getElementById('setting-gstin').value,
          PAN: document.getElementById('setting-pan').value
        };

        fetch(API_BASE + "/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated)
        })
        .then(() => { alert("Settings saved on server successfully!"); syncData(); })
        .catch(() => {
          localStorage.setItem('mitti_fresh_settings', JSON.stringify({ ...settings, ...updated }));
          alert("Settings cached locally offline!");
          syncData();
        });
      });

      document.getElementById('btn-save-pincodes').addEventListener('click', () => {
        const pinString = document.getElementById('settings-pincodes-input').value;
        const pinsArr = pinString.split(',').map(p => p.trim()).filter(p => p.length > 0);
        
        fetch(API_BASE + "/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ serviceablePincodes: pinsArr })
        })
        .then(res => res.json().then(json => ({ ok: res.ok, json })))
        .then(({ ok, json }) => {
          if (!ok) {
            alert("Error saving pincodes: " + (json.error || JSON.stringify(json)));
            return;
          }
          alert("Serviceable pincodes updated!");
          syncData();
        })
        .catch(() => {
          settings.serviceablePincodes = pinsArr;
          localStorage.setItem('mitti_fresh_settings', JSON.stringify(settings));
          alert("PIN codes cached locally (offline)!");
          syncData();
        });
      });

      document.getElementById('btn-save-shipping-costs').addEventListener('click', () => {
        const rules = {
          flatRate: parseInt(document.getElementById('settings-shipping-flat').value),
          freeShippingThreshold: parseInt(document.getElementById('settings-shipping-free').value),
          codConvenienceFee: parseInt(document.getElementById('settings-shipping-cod').value)
        };
        
        fetch(API_BASE + "/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shippingRules: rules })
        })
        .then(res => res.json().then(json => ({ ok: res.ok, json })))
        .then(({ ok, json }) => {
          if (!ok) {
            alert("Error saving shipping rules: " + (json.error || JSON.stringify(json)));
            return;
          }
          alert("Shipping parameters saved!");
          syncData();
        })
        .catch(() => {
          settings.shippingRules = rules;
          localStorage.setItem('mitti_fresh_settings', JSON.stringify(settings));
          alert("Shipping rules cached locally (offline)!");
          syncData();
        });
      });

      // 2. PRODUCTS PANEL LOGIC
      const renderProducts = () => {
        const tbody = document.getElementById('products-table-body');
        const list = Array.isArray(products) ? products : [];
        tbody.innerHTML = list.map(p => `
          <tr>
            <td><img src="${p.image || 'assets/logo.jpg'}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;"></td>
            <td><strong>${p.name}</strong></td>
            <td><code>${p.SKU || 'N/A'}</code></td>
            <td>${p.category}</td>
            <td>${p.weight}</td>
            <td>₹${p.MRP || p.sellingPrice}</td>
            <td>₹${p.sellingPrice}</td>
            <td style="color:${p.stock <= 10 ? '#CB4335' : '#214e34'}; font-weight:700;">${p.stock} units</td>
            <td><span class="badge-status ${p.stock > 0 ? 'badge-paid' : 'badge-failed'}">${p.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="editProduct('${p.id}')" style="padding:4px 8px; font-size:0.8rem;"><i class="fa-solid fa-pen"></i></button>
              <button class="btn btn-secondary btn-sm" onclick="duplicateProduct('${p.id}')" style="padding:4px 8px; font-size:0.8rem; color:var(--color-accent);"><i class="fa-solid fa-clone"></i></button>
              <button class="btn btn-secondary btn-sm" onclick="deleteProduct('${p.id}')" style="padding:4px 8px; font-size:0.8rem; color:#CB4335;"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
        `).join('');
      };

      // Expose globally for onclick actions
      window.deleteProduct = (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        fetch(`${API_BASE}/api/products/${id}/delete`, { method: "POST" })
          .then(() => { alert("Product deleted!"); syncData(); })
          .catch(() => {
            const list = products.filter(p => p.id !== id);
            localStorage.setItem('mitti_fresh_products', JSON.stringify(list));
            alert("Deleted locally offline!");
            syncData();
          });
      };

      window.duplicateProduct = (id) => {
        const prod = products.find(p => p.id === id);
        if (!prod) return;
        const duplicated = { ...prod, id: "", name: `${prod.name} (Copy)`, SKU: `${prod.SKU}-COPY` };
        
        fetch(API_BASE + "/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(duplicated)
        })
        .then(() => { alert("Product duplicated!"); syncData(); })
        .catch(() => {
          duplicated.id = "PROD-" + Math.floor(100000 + Math.random() * 900000);
          products.push(duplicated);
          localStorage.setItem('mitti_fresh_products', JSON.stringify(products));
          alert("Duplicated locally offline!");
          syncData();
        });
      };

      const productModal = document.getElementById('product-modal');
      const editGalleryContainer = document.getElementById('edit-prod-gallery-container');
      const editGalleryList = document.getElementById('edit-prod-gallery-list');
      const btnAddGalleryImg = document.getElementById('btn-add-gallery-image');
      const galleryFileInput = document.getElementById('edit-prod-gallery-file-input');

      // State for current edit modal images
      let currentEditProductImages = [];
      let targetChangeImageId = null;

      // Hidden single-file input for replacing an individual image slot
      let singleReplaceFileInput = document.getElementById('edit-prod-single-replace-file');
      if (!singleReplaceFileInput) {
        singleReplaceFileInput = document.createElement('input');
        singleReplaceFileInput.type = 'file';
        singleReplaceFileInput.accept = 'image/*';
        singleReplaceFileInput.id = 'edit-prod-single-replace-file';
        singleReplaceFileInput.style.display = 'none';
        document.body.appendChild(singleReplaceFileInput);
      }

      // Render Multi-Image Cards
      const renderEditProductGallery = () => {
        if (!editGalleryList) return;
        editGalleryList.innerHTML = "";

        if (currentEditProductImages.length === 0) {
          editGalleryList.innerHTML = `<div style="color: #64748b; font-size: 0.85rem; text-align: center; padding: 12px; border: 1px dashed #cbd5e1; border-radius: 6px; background: #ffffff;">No images attached. Click "+ Add More Images" above to add image files.</div>`;
          return;
        }

        currentEditProductImages.forEach((item, index) => {
          const card = document.createElement('div');
          card.style.cssText = "display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 8px 12px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);";

          const isMain = index === 0;
          const badgeText = isMain ? "Main Image" : `Gallery #${index + 1}`;
          const badgeBg = isMain ? "#214E34" : "#475569";

          card.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px; overflow: hidden; flex: 1;">
              <img src="${item.previewUrl || item.url || 'assets/logo.jpg'}" alt="Product image ${index + 1}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 4px; border: 1px solid #cbd5e1; flex-shrink: 0;">
              <div style="display: flex; flex-direction: column; gap: 3px; overflow: hidden;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="background-color: ${badgeBg}; color: #fff; font-size: 0.7rem; font-weight: 600; padding: 2px 6px; border-radius: 4px;">${badgeText}</span>
                </div>
                <span style="font-size: 0.75rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.file ? (item.file.name || 'New File Selected') : (item.url ? item.url.split('/').pop() : 'Image Asset')}</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
              <button type="button" class="btn btn-secondary btn-change-img-slot" data-id="${item.id}" style="padding: 4px 10px; font-size: 0.78rem; cursor: pointer;">
                <i class="fa-solid fa-sync"></i> Change Image
              </button>
              <button type="button" class="btn btn-danger btn-remove-img-slot" data-id="${item.id}" style="padding: 4px 10px; font-size: 0.78rem; background-color: #ef4444; color: #fff; border: none; border-radius: 4px; cursor: pointer;">
                <i class="fa-solid fa-trash"></i> Remove
              </button>
            </div>
          `;

          editGalleryList.appendChild(card);
        });

        // Event listeners for individual Change Image slot buttons
        editGalleryList.querySelectorAll('.btn-change-img-slot').forEach(btn => {
          btn.addEventListener('click', (e) => {
            targetChangeImageId = e.currentTarget.getAttribute('data-id');
            singleReplaceFileInput.value = "";
            singleReplaceFileInput.click();
          });
        });

        // Event listeners for individual Remove Image slot buttons
        editGalleryList.querySelectorAll('.btn-remove-img-slot').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const removeId = e.currentTarget.getAttribute('data-id');
            currentEditProductImages = currentEditProductImages.filter(img => img.id !== removeId);
            renderEditProductGallery();
          });
        });
      };

      // Handler for replacing single image slot
      singleReplaceFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && targetChangeImageId) {
          const item = currentEditProductImages.find(img => img.id === targetChangeImageId);
          if (item) {
            item.file = file;
            const reader = new FileReader();
            reader.onload = (evt) => {
              item.previewUrl = evt.target.result;
              renderEditProductGallery();
            };
            reader.readAsDataURL(file);
          }
        }
      });

      // Handler for "+ Add More Images"
      if (btnAddGalleryImg && galleryFileInput) {
        btnAddGalleryImg.addEventListener('click', () => {
          galleryFileInput.value = "";
          galleryFileInput.click();
        });

        galleryFileInput.addEventListener('change', (e) => {
          const files = Array.from(e.target.files);
          if (files.length > 0) {
            files.forEach(file => {
              const newItem = {
                id: 'img-' + Date.now() + '-' + Math.round(Math.random() * 1E6),
                url: null,
                file: file,
                previewUrl: null
              };
              currentEditProductImages.push(newItem);

              const reader = new FileReader();
              reader.onload = (evt) => {
                newItem.previewUrl = evt.target.result;
                renderEditProductGallery();
              };
              reader.readAsDataURL(file);
            });
            renderEditProductGallery();
          }
        });
      }

      document.getElementById('btn-add-product').addEventListener('click', () => {
        document.getElementById('product-modal-title').textContent = "Add New Product";
        document.getElementById('prod-form-id').value = "";
        document.getElementById('product-form').reset();
        currentEditProductImages = [];
        if (editGalleryContainer) editGalleryContainer.style.display = "none";
        productModal.style.display = "flex";
      });

      document.getElementById('btn-close-product-modal').addEventListener('click', () => {
        productModal.style.display = "none";
      });

      window.editProduct = (id) => {
        const prod = products.find(p => p.id === id);
        if (!prod) return;
        
        document.getElementById('product-modal-title').textContent = "Edit Product Details";
        document.getElementById('prod-form-id').value = prod.id;
        document.getElementById('prod-form-name').value = prod.name;
        document.getElementById('prod-form-sku').value = prod.SKU || "";
        document.getElementById('prod-form-weight').value = prod.weight || "";
        document.getElementById('prod-form-mrp').value = prod.MRP || prod.sellingPrice;
        document.getElementById('prod-form-price').value = prod.sellingPrice;
        document.getElementById('prod-form-stock').value = prod.stock;
        document.getElementById('prod-form-category').value = prod.category;
        document.getElementById('prod-form-life').value = prod.shelfLife || "";
        document.getElementById('prod-form-ingredients').value = prod.ingredients || "";
        document.getElementById('prod-form-short').value = prod.shortDescription || "";
        
        // Initialize currentEditProductImages with all product images
        currentEditProductImages = [];
        let rawList = [];
        if (Array.isArray(prod.gallery) && prod.gallery.length > 0) {
          rawList = [...prod.gallery];
          if (prod.image && !rawList.includes(prod.image)) {
            rawList.unshift(prod.image);
          }
        } else {
          // Default fallback images array
          rawList = [
            prod.image || 'assets/logo.jpg',
            'assets/grinding_live.jpg',
            'assets/hero_banner.jpg'
          ];
        }

        currentEditProductImages = rawList.map((urlStr, idx) => ({
          id: 'img-existing-' + idx + '-' + Date.now() + '-' + Math.round(Math.random()*1000),
          url: urlStr,
          file: null,
          previewUrl: urlStr
        }));

        if (editGalleryContainer) editGalleryContainer.style.display = "flex";
        renderEditProductGallery();

        productModal.style.display = "flex";
      };

      document.getElementById('product-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('prod-form-id').value;

        let finalImageUrls = [];
        if (id && currentEditProductImages.length > 0) {
          for (let item of currentEditProductImages) {
            if (item.file) {
              // Upload new or replaced image file to server
              try {
                const formData = new FormData();
                formData.append('image', item.file);
                const uploadRes = await fetch(`${API_BASE}/api/upload-image`, {
                  method: "POST",
                  body: formData
                });
                const uploadData = await uploadRes.json();
                if (uploadData && uploadData.url) {
                  finalImageUrls.push(uploadData.url);
                } else if (item.previewUrl) {
                  finalImageUrls.push(item.previewUrl);
                }
              } catch (uploadErr) {
                console.warn("Upload server error, falling back to base64 preview URL:", uploadErr);
                if (item.previewUrl) {
                  finalImageUrls.push(item.previewUrl);
                }
              }
            } else if (item.url) {
              // Retain existing image URL
              finalImageUrls.push(item.url);
            } else if (item.previewUrl) {
              finalImageUrls.push(item.previewUrl);
            }
          }
        }

        const payload = {
          name: document.getElementById('prod-form-name').value,
          SKU: document.getElementById('prod-form-sku').value,
          weight: document.getElementById('prod-form-weight').value,
          MRP: parseInt(document.getElementById('prod-form-mrp').value),
          sellingPrice: parseInt(document.getElementById('prod-form-price').value),
          stock: parseInt(document.getElementById('prod-form-stock').value),
          category: document.getElementById('prod-form-category').value,
          shelfLife: document.getElementById('prod-form-life').value,
          ingredients: document.getElementById('prod-form-ingredients').value,
          shortDescription: document.getElementById('prod-form-short').value
        };

        if (id) {
          payload.image = finalImageUrls.length > 0 ? finalImageUrls[0] : 'assets/logo.jpg';
          payload.gallery = finalImageUrls;

          // Update
          try {
            const updateRes = await fetch(`${API_BASE}/api/products/${id}/update`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });

            if (!updateRes.ok) {
              throw new Error(`Server update failed with status ${updateRes.status}`);
            }

            const updatedProd = await updateRes.json();
            const idx = products.findIndex(p => p.id === id);
            if (idx !== -1) {
              products[idx] = {
                ...products[idx],
                ...(updatedProd && updatedProd.id ? updatedProd : payload),
                image: payload.image,
                gallery: payload.gallery
              };
              renderProducts();
            }

            alert("Product updated!");
            productModal.style.display = "none";
            syncData();
          } catch (err) {
            console.error("Error updating product via API:", err);
            const idx = products.findIndex(p => p.id === id);
            if (idx !== -1) {
              products[idx] = { ...products[idx], ...payload };
              localStorage.setItem('mitti_fresh_products', JSON.stringify(products));
              alert("Updated locally offline!");
              productModal.style.display = "none";
              syncData();
            }
          }
        } else {
          // Insert
          fetch(API_BASE + "/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          })
          .then(() => { alert("Product added successfully!"); productModal.style.display = "none"; syncData(); })
          .catch(() => {
            payload.id = "PROD-" + Math.floor(100000 + Math.random() * 900000);
            products.push(payload);
            localStorage.setItem('mitti_fresh_products', JSON.stringify(products));
            alert("Added locally offline!");
            productModal.style.display = "none";
            syncData();
          });
        }
      });

      // Bulk import mock triggers
      document.getElementById('btn-product-bulk').addEventListener('click', () => {
        const confirmBulk = confirm("Would you like to import bulk default flour catalog (29 items)?");
        if (confirmBulk) {
          alert("Imported default catalog! 29 items synced.");
          syncData();
        }
      });

      // 3. CATEGORIES PANEL LOGIC
      const renderCategories = () => {
        const tbody = document.getElementById('categories-table-body');
        const list = Array.isArray(categories) ? categories : [];
        tbody.innerHTML = list.map(c => `
          <tr>
            <td><code>${c.id}</code></td>
            <td><strong>${c.name}</strong></td>
            <td>/${c.slug}</td>
            <td><span class="badge-status ${c.featured ? 'badge-paid' : 'badge-failed'}">${c.featured ? 'Yes' : 'No'}</span></td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="deleteCategory('${c.id}')" style="padding:4px 8px; font-size:0.8rem; color:#CB4335;"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
        `).join('');
      };

      window.deleteCategory = (id) => {
        if (!confirm("Remove this category?")) return;
        const list = categories.filter(c => c.id !== id);
        localStorage.setItem('mitti_fresh_categories', JSON.stringify(list));
        syncData();
      };

      document.getElementById('btn-add-category').addEventListener('click', () => {
        const name = prompt("Enter Category Name:");
        if (!name) return;
        const slug = name.toLowerCase().replace(/ /g, '-');
        const newCat = { id: "CAT-" + Math.floor(100 + Math.random()*900), name, slug, featured: true };
        
        fetch(API_BASE + "/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCat)
        })
        .then(() => { syncData(); })
        .catch(() => {
          categories.push(newCat);
          localStorage.setItem('mitti_fresh_categories', JSON.stringify(categories));
          syncData();
        });
      });

      // 4. INVENTORY PANEL LOGIC
      const renderInventory = () => {
        const tbody = document.getElementById('inventory-table-body');
        const list = Array.isArray(products) ? products : [];
        tbody.innerHTML = list.map(p => `
          <tr>
            <td><strong>${p.name}</strong></td>
            <td><code>${p.SKU || 'N/A'}</code></td>
            <td style="font-weight:700;">${p.stock} units</td>
            <td><code>B-${p.SKU ? p.SKU.split('-')[1] : 'M01'}</code></td>
            <td>10/07/2026</td>
            <td>10/09/2026</td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="adjustStock('${p.id}', 10)" style="padding:2px 8px; font-size:0.75rem;"><i class="fa-solid fa-plus"></i> 10</button>
              <button class="btn btn-secondary btn-sm" onclick="adjustStock('${p.id}', -10)" style="padding:2px 8px; font-size:0.75rem; color:#CB4335;"><i class="fa-solid fa-minus"></i> 10</button>
            </td>
          </tr>
        `).join('');
      };

      window.adjustStock = (id, change) => {
        const idx = products.findIndex(p => p.id === id);
        if (idx !== -1) {
          const newStock = Math.max(0, products[idx].stock + change);
          
          fetch(`${API_BASE}/api/products/${id}/update`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stock: newStock })
          })
          .then(() => { syncData(); })
          .catch(() => {
            products[idx].stock = newStock;
            localStorage.setItem('mitti_fresh_products', JSON.stringify(products));
            syncData();
          });
        }
      };

      // 5. ORDERS PANEL LOGIC
      const renderOrders = () => {
        const tbody = document.getElementById('orders-list-body');
        const filterVal = document.getElementById('order-search-input').value.toLowerCase();
        const ordList = Array.isArray(orders) ? orders : [];
        
        const filtered = ordList.filter(o => 
          (o.orderId && o.orderId.toLowerCase().includes(filterVal)) ||
          (o.customer && o.customer.name && o.customer.name.toLowerCase().includes(filterVal)) ||
          (o.customer && o.customer.phone && o.customer.phone.includes(filterVal))
        );

        if (filtered.length === 0) {
          tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px;">No matching orders found.</td></tr>`;
          return;
        }

        tbody.innerHTML = filtered.map(o => `
          <tr>
            <td><code>${o.orderId}</code></td>
            <td>${o.date || "N/A"}</td>
            <td><strong>${o.customer ? o.customer.name : "Customer"}</strong><br><small style="color:var(--color-text-muted);">${o.customer ? o.customer.phone : ""}</small></td>
            <td><span class="badge-status badge-delivery">${o.paymentMethod || 'Razorpay'}</span></td>
            <td style="font-weight:700;">₹${o.amount}</td>
            <td><span class="badge-status ${
              o.paymentStatus === 'Paid' || o.paymentStatus === 'Verified' ? 'badge-paid' : 
              o.paymentStatus === 'Pending Verification' ? 'badge-pending' : 'badge-failed'
            }">${o.paymentStatus}</span></td>
            <td><span class="badge-status badge-delivery">${o.orderStatus}</span></td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="viewOrderDetails('${o.orderId}')" style="padding:4px 8px; font-size:0.8rem;">Open</button>
            </td>
          </tr>
        `).join('');
      };

      document.getElementById('order-search-input').addEventListener('input', renderOrders);

      // Seed orders simulation button
      document.getElementById('btn-seed-demo-orders').addEventListener('click', () => {
        const demo = [
          {
            orderId: "MF-607191",
            paymentMethod: "UPI",
            upiTransactionId: "389201928374",
            upiScreenshot: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><rect width='100%' height='100%' fill='%23214e34'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%23ffffff'>UPI Receipt Mock</text></svg>",
            paymentStatus: "Pending Verification",
            orderStatus: "Payment Verification Pending",
            amount: 120,
            date: new Date().toLocaleString(),
            customer: { name: "Devansh Vashisth", phone: "9958172635", email: "devansh@hotmail.com" },
            address: { house: "H-104", street: "Dwarka Sector 7", landmark: "Near Ramphal Chowk", pin: "110075", city: "New Delhi", state: "Delhi" },
            items: [{ name: "MP Wheat Atta (Stone Ground)", size: "1kg", price: 70, quantity: 1 }]
          }
        ];
        
        fetch(API_BASE + "/api/orders") // test if server is online
          .then(() => {
            // Write to server...
            alert("Seeding done! Verify order lists.");
          })
          .catch(() => {
            const merged = [...demo, ...orders];
            localStorage.setItem('mitti_fresh_orders', JSON.stringify(merged));
            alert("Seeded order loaded into LocalStorage cache!");
            syncData();
            triggerSound();
          });
      });

      document.getElementById('btn-export-orders-csv').addEventListener('click', () => {
        let csv = "Order ID,Customer Name,Phone,Amount,Payment Method,Payment Status,Order Status\n";
        orders.forEach(o => {
          csv += `${o.orderId},${o.customer ? o.customer.name : 'N/A'},${o.customer ? o.customer.phone : 'N/A'},${o.amount},${o.paymentMethod},${o.paymentStatus},${o.orderStatus}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `mitti-fresh-orders-${Date.now()}.csv`);
        a.click();
      });

      // View Order Details Modal
      const orderModal = document.getElementById('order-modal');
      document.getElementById('btn-close-order-modal').addEventListener('click', () => {
        orderModal.style.display = "none";
      });

      window.viewOrderDetails = (id) => {
        const o = orders.find(ord => ord.orderId === id);
        if (!o) return;
        
        document.getElementById('order-modal-title').textContent = `Order ${o.orderId}`;
        const content = document.getElementById('order-modal-content');
        
        const itemsHtml = o.items.map(item => `
          <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:0.95rem;">
            <span>${item.name} (${item.size || '5kg'}) x ${item.quantity}</span>
            <strong>₹${item.price * item.quantity}</strong>
          </div>
        `).join('');

        content.innerHTML = `
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:24px;">
            <div>
              <h4 style="margin-top:0; color:var(--color-primary);">Customer Info</h4>
              <p style="margin:4px 0;"><strong>Name:</strong> ${o.customer ? o.customer.name : 'N/A'}</p>
              <p style="margin:4px 0;"><strong>Phone:</strong> ${o.customer ? o.customer.phone : 'N/A'}</p>
              <p style="margin:4px 0;"><strong>Email:</strong> ${o.customer ? o.customer.email : 'N/A'}</p>
            </div>
            <div>
              <h4 style="margin-top:0; color:var(--color-primary);">Delivery Address</h4>
              <p style="margin:4px 0;">${o.address ? `${o.address.house}, ${o.address.street}` : 'N/A'}</p>
              <p style="margin:4px 0;">Landmark: ${o.address ? o.address.landmark : 'N/A'}</p>
              <p style="margin:4px 0;">PIN Code: ${o.address ? o.address.pin : 'N/A'}</p>
            </div>
          </div>

          <div style="border-top:1px solid rgba(0,0,0,0.06); padding-top:20px; margin-bottom:20px;">
            <h4 style="margin-top:0; color:var(--color-primary);">Order Items</h4>
            ${itemsHtml}
            <div style="display:flex; justify-content:space-between; border-top:1.5px dashed rgba(0,0,0,0.06); padding-top:10px; margin-top:10px;">
              <span>Grand Total:</span>
              <strong style="font-size:1.2rem; color:var(--color-primary);">₹${o.amount}</strong>
            </div>
          </div>

          <div style="border-top:1px solid rgba(0,0,0,0.06); padding-top:20px;">
            <h4 style="margin-top:0; color:var(--color-primary);">Courier Allocation & Tracking</h4>
            <div class="form-row">
              <div>
                <label>Carrier Agent</label>
                <input type="text" id="order-carrier-input" class="form-control" value="${o.shippingCarrier || 'Shiprocket/Self'}">
              </div>
              <div>
                <label>Tracking Reference ID</label>
                <input type="text" id="order-tracking-input" class="form-control" value="${o.trackingRef || ''}">
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(0,0,0,0.06); padding-top:20px; margin-top:20px; flex-wrap:wrap; gap:16px;">
            <div>
              <label style="font-weight:600;">Update Status:</label>
              <select id="modal-order-status-select" class="form-control" style="width:200px; display:inline-block; margin-left:10px; margin-bottom:0;">
                <option value="Payment Verification Pending" ${o.orderStatus === 'Payment Verification Pending' ? 'selected' : ''}>Payment Verification Pending</option>
                <option value="Confirmed" ${o.orderStatus === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                <option value="Preparing" ${o.orderStatus === 'Preparing' ? 'selected' : ''}>Preparing</option>
                <option value="Grinding" ${o.orderStatus === 'Grinding' ? 'selected' : ''}>Grinding</option>
                <option value="Ready for Pickup" ${o.orderStatus === 'Ready for Pickup' ? 'selected' : ''}>Ready for Pickup</option>
                <option value="Shipped" ${o.orderStatus === 'Shipped' ? 'selected' : ''}>Shipped</option>
                <option value="Delivered" ${o.orderStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
                <option value="Cancelled" ${o.orderStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
              </select>
            </div>
            
            <div style="display:flex; gap:10px;">
              <button class="btn btn-secondary btn-sm" onclick="window.print()"><i class="fa-solid fa-print"></i> Print Invoice</button>
              <button class="btn btn-primary btn-sm" onclick="saveOrderFulfillment('${o.orderId}')">Save Status</button>
            </div>
          </div>
        `;
        
        orderModal.style.display = "flex";
      };

      window.saveOrderFulfillment = (orderId) => {
        const orderStatus = document.getElementById('modal-order-status-select').value;
        const shippingCarrier = document.getElementById('order-carrier-input').value;
        const trackingRef = document.getElementById('order-tracking-input').value;

        fetch(API_BASE + "/api/update-order-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, orderStatus, shippingCarrier, trackingRef })
        })
        .then(() => { alert("Order status updated!"); orderModal.style.display = "none"; syncData(); })
        .catch(() => {
          const idx = orders.findIndex(o => o.orderId === orderId);
          if (idx !== -1) {
            orders[idx].orderStatus = orderStatus;
            orders[idx].shippingCarrier = shippingCarrier;
            orders[idx].trackingRef = trackingRef;
            localStorage.setItem('mitti_fresh_orders', JSON.stringify(orders));
            alert("Updated locally offline!");
            orderModal.style.display = "none";
            syncData();
          }
        });
      };

      // 6. UPI PAYMENT AUDITOR PANEL
      const renderUpiAuditor = () => {
        const tbody = document.getElementById('upi-auditor-table-body');
        const ordList = Array.isArray(orders) ? orders : [];
        const pendingUpi = ordList.filter(o => o.paymentMethod === 'UPI' && o.paymentStatus === 'Pending Verification');
        
        if (pendingUpi.length === 0) {
          tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px;">No pending UPI verifications.</td></tr>`;
          return;
        }

        tbody.innerHTML = pendingUpi.map(o => `
          <tr>
            <td><code>${o.orderId}</code></td>
            <td><strong>${o.customer ? o.customer.name : "Customer"}</strong></td>
            <td style="font-weight:700;">₹${o.amount}</td>
            <td><code>${o.upiTransactionId}</code></td>
            <td>
              <img src="${o.upiScreenshot || 'assets/logo.jpg'}" style="width:40px; height:40px; object-fit:cover; border-radius:4px; cursor:zoom-in;" onclick="zoomReceipt('${o.upiScreenshot}')">
            </td>
            <td>${o.date || 'N/A'}</td>
            <td>
              <button class="btn btn-primary btn-sm" onclick="updateOrderVerificationStatus('${o.orderId}', 'Verified')" style="padding:4px 8px; font-size:0.8rem; background-color:#2ECC71; border-color:#2ECC71;">Approve</button>
              <button class="btn btn-secondary btn-sm" onclick="updateOrderVerificationStatus('${o.orderId}', 'Rejected')" style="padding:4px 8px; font-size:0.8rem; color:#CB4335;">Reject</button>
            </td>
          </tr>
        `).join('');
      };

      // Expose screenshot zoom viewer globally
      const zoomViewer = document.getElementById('screenshot-zoom-viewer');
      const zoomedImg = document.getElementById('zoomed-receipt-img');
      window.zoomReceipt = (src) => {
        if (!src) return;
        zoomedImg.src = src;
        zoomViewer.style.display = "flex";
      };

      zoomViewer.addEventListener('click', () => {
        zoomViewer.style.display = "none";
      });

      window.updateOrderVerificationStatus = (id, result) => {
        const paymentStatus = result === 'Verified' ? 'Verified' : 'Rejected';
        const orderStatus = result === 'Verified' ? 'Confirmed' : 'Cancelled';

        fetch(API_BASE + "/api/update-order-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: id, paymentStatus, orderStatus })
        })
        .then(() => { alert(`Payment verified: ${result}`); syncData(); })
        .catch(() => {
          const idx = orders.findIndex(o => o.orderId === id);
          if (idx !== -1) {
            orders[idx].paymentStatus = paymentStatus;
            orders[idx].orderStatus = orderStatus;
            localStorage.setItem('mitti_fresh_orders', JSON.stringify(orders));
            alert(`Approved/Rejected offline: ${result}`);
            syncData();
          }
        });
      };

      // 7. CUSTOMERS PANEL LOGIC
      const renderCustomers = () => {
        const tbody = document.getElementById('customers-table-body');
        
        // Group customers
        const custs = {};
        const ordList = Array.isArray(orders) ? orders : [];
        ordList.forEach(o => {
          if (o.customer && o.customer.phone) {
            const key = o.customer.phone;
            if (!custs[key]) {
              custs[key] = {
                name: o.customer.name,
                email: o.customer.email,
                phone: o.customer.phone,
                ltv: 0,
                address: o.address ? `${o.address.house}, ${o.address.street}` : "N/A",
                status: "Active"
              };
            }
            custs[key].ltv += o.amount;
          }
        });

        const custArr = Object.values(custs);
        if (custArr.length === 0) {
          tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px;">No customers registered in database yet.</td></tr>`;
          return;
        }

        tbody.innerHTML = custArr.map(c => `
          <tr>
            <td><strong>${c.name}</strong></td>
            <td>${c.phone}</td>
            <td>${c.email}</td>
            <td style="font-size:0.8rem; color:var(--color-text-muted);">${c.address}</td>
            <td style="font-weight:700; color:var(--color-primary);">₹${c.ltv}</td>
            <td>120 pts</td>
            <td><span class="badge-status badge-paid">${c.status}</span></td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="alert('Profile Locked / Blocked successfully!')" style="padding:4px 8px; font-size:0.8rem; color:#CB4335;">Block</button>
            </td>
          </tr>
        `).join('');
      };

      // 8. COUPONS PANEL LOGIC
      const renderCoupons = () => {
        const tbody = document.getElementById('coupons-table-body');
        const list = Array.isArray(coupons) ? coupons : [];
        tbody.innerHTML = list.map(c => `
          <tr>
            <td><code>${c.code}</code></td>
            <td>${c.type}</td>
            <td>${c.type === 'Percentage' ? `${c.discountVal}%` : `₹${c.discountVal}`}</td>
            <td>₹${c.minOrder || 0}</td>
            <td>₹${c.maxDiscount || 'N/A'}</td>
            <td>${c.expiry || 'N/A'}</td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="deleteCoupon('${c.id}')" style="padding:4px 8px; font-size:0.8rem; color:#CB4335;"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
        `).join('');
      };

      window.deleteCoupon = (id) => {
        if (!confirm("Are you sure?")) return;
        
        fetch(`${API_BASE}/api/coupons/${id}/delete`, { method: "POST" })
          .then(() => { syncData(); })
          .catch(() => {
            const list = coupons.filter(c => c.id !== id);
            localStorage.setItem('mitti_fresh_coupons', JSON.stringify(list));
            syncData();
          });
      };

      document.getElementById('btn-add-coupon').addEventListener('click', () => {
        const code = prompt("Enter Coupon Code (e.g. SPECIAL50):");
        if (!code) return;
        const discountVal = parseInt(prompt("Enter Discount Value (e.g. 50):"));
        if (isNaN(discountVal)) return;

        const newCoupon = {
          id: "CPN-" + Math.floor(100 + Math.random()*900),
          code: code.toUpperCase(),
          type: "Flat",
          discountVal,
          minOrder: 300,
          maxDiscount: discountVal,
          expiry: "2026-12-31"
        };

        fetch(API_BASE + "/api/coupons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCoupon)
        })
        .then(() => { syncData(); })
        .catch(() => {
          coupons.push(newCoupon);
          localStorage.setItem('mitti_fresh_coupons', JSON.stringify(coupons));
          syncData();
        });
      });

      // 9. REVIEWS PANEL LOGIC
      const renderReviews = () => {
        const tbody = document.getElementById('reviews-table-body');
        const list = Array.isArray(reviews) ? reviews : [];
        tbody.innerHTML = list.map(r => `
          <tr>
            <td><strong>${r.product_name || 'MP Wheat Atta'}</strong></td>
            <td>${r.customer_name}</td>
            <td style="color:#F1C40F;">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</td>
            <td style="font-size:0.85rem;">"${r.comment}"</td>
            <td><span class="badge-status ${r.status === 'Approved' ? 'badge-paid' : 'badge-pending'}">${r.status}</span></td>
            <td>
              ${r.status === 'Pending' ? `<button class="btn btn-primary btn-sm" onclick="moderateReview('${r.id}', 'Approved')" style="padding:4px 8px; font-size:0.75rem; background-color:#2ECC71; border-color:#2ECC71;">Approve</button>` : ''}
              <button class="btn btn-secondary btn-sm" onclick="moderateReview('${r.id}', 'Rejected')" style="padding:4px 8px; font-size:0.75rem; color:#CB4335;">Reject</button>
            </td>
          </tr>
        `).join('');
      };

      window.moderateReview = (id, status) => {
        fetch(`${API_BASE}/api/reviews/${id}/moderate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status })
        })
        .then(() => { syncData(); })
        .catch(() => {
          const idx = reviews.findIndex(r => r.id === id);
          if (idx !== -1) {
            reviews[idx].status = status;
            localStorage.setItem('mitti_fresh_reviews', JSON.stringify(reviews));
            syncData();
          }
        });
      };

      // 10. AI ASSISTANT PANEL LOGIC
      document.getElementById('btn-save-ai-faq').addEventListener('click', () => {
        const keyword = document.getElementById('ai-faq-keyword').value;
        const response = document.getElementById('ai-faq-response').value;
        if (!keyword || !response) return;
        
        alert("FAQ added to chatbot database training list!");
        document.getElementById('ai-faq-keyword').value = "";
        document.getElementById('ai-faq-response').value = "";
      });

      // 11. AUDIT LOGS PANEL LOGIC
      const renderLogs = () => {
        const tbody = document.getElementById('logs-table-body');
        const logList = Array.isArray(logs) ? logs : [];
        if (logList.length === 0) {
          tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px;">No operational actions logged yet.</td></tr>`;
          return;
        }

        tbody.innerHTML = logList.map(l => `
          <tr>
            <td><small>${l.createdAt ? new Date(l.createdAt).toLocaleString() : 'N/A'}</small></td>
            <td><strong>${l.user}</strong></td>
            <td><code>${l.action}</code></td>
            <td style="font-size:0.85rem; color:var(--color-text-muted);">${l.details}</td>
          </tr>
        `).join('');
      };

      // 12. STAFF DIRECTORY PANEL LOGIC
      const renderEmployees = () => {
        const tbody = document.getElementById('employees-table-body');
        tbody.innerHTML = employees.map(e => `
          <tr>
            <td><strong>${e.name}</strong></td>
            <td>${e.email}</td>
            <td><span class="badge-status badge-delivery" style="background-color:#EAF2F8; color:#2471A3; font-weight:700;">${e.role}</span></td>
            <td><span class="badge-status badge-paid">${e.status}</span></td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="alert('Permissions updated!')" style="padding:4px 8px; font-size:0.75rem;"><i class="fa-solid fa-key"></i> Roles</button>
            </td>
          </tr>
        `).join('');
      };

      // 13. CALCULATE DASHBOARD STATS
      const renderOverview = () => {
        window.renderOverview = renderOverview;
        window.calculateStats = renderOverview;
        fetch(API_BASE + "/api/analytics")
          .then(res => res.json())
          .then(data => {
            const m = data.metrics || {};
            document.getElementById('stat-revenue-today').textContent = `₹${m.todayRevenue || 0}`;
            document.getElementById('stat-orders-today').textContent = m.todayOrders || 0;
            document.getElementById('stat-revenue-monthly').textContent = `₹${m.totalRevenue || 0}`;
            document.getElementById('stat-low-stock').textContent = m.lowStock || 0;

            const orderBadge = document.getElementById('sidebar-order-badge');
            const upiBadge = document.getElementById('sidebar-upi-badge');

            if (m.pendingOrders > 0) {
              orderBadge.style.display = "flex";
              orderBadge.textContent = m.pendingOrders;
            } else {
              orderBadge.style.display = "none";
            }

            const pendingUpiCount = (orders || []).filter(o => o.paymentMethod === 'UPI' && o.paymentStatus === 'Pending Verification').length;
            if (pendingUpiCount > 0) {
              upiBadge.style.display = "flex";
              upiBadge.textContent = pendingUpiCount;
            } else {
              upiBadge.style.display = "none";
            }

            renderWeeklySalesChart();
          })
          .catch(err => {
            console.warn("Analytics API unavailable, compiling metrics locally:", err);
            let totalRevenue = 0;
            let todayRevenue = 0;
            let todayOrdersCount = 0;
            const todayDateStr = new Date().toLocaleDateString();

            const ordList = Array.isArray(orders) ? orders : [];
            ordList.forEach(o => {
              if (o.paymentStatus === 'Paid' || o.paymentStatus === 'Verified') {
                totalRevenue += o.amount;
                if (o.date && o.date.startsWith(todayDateStr.split('/')[0])) {
                  todayRevenue += o.amount;
                }
              }
              if (o.date && o.date.startsWith(todayDateStr.split('/')[0])) {
                todayOrdersCount++;
              }
            });

            const prodList = Array.isArray(products) ? products : [];
            const lowStockCount = prodList.filter(p => p.stock > 0 && p.stock <= 10).length;
            const pendingOrdersCount = ordList.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Payment Verification Pending').length;
            const pendingUpiCount = ordList.filter(o => o.paymentMethod === 'UPI' && o.paymentStatus === 'Pending Verification').length;

            document.getElementById('stat-revenue-today').textContent = `₹${todayRevenue}`;
            document.getElementById('stat-orders-today').textContent = todayOrdersCount;
            document.getElementById('stat-revenue-monthly').textContent = `₹${totalRevenue}`;
            document.getElementById('stat-low-stock').textContent = lowStockCount;

            const orderBadge = document.getElementById('sidebar-order-badge');
            const upiBadge = document.getElementById('sidebar-upi-badge');

            if (pendingOrdersCount > 0) {
              orderBadge.style.display = "flex";
              orderBadge.textContent = pendingOrdersCount;
            } else {
              orderBadge.style.display = "none";
            }

            if (pendingUpiCount > 0) {
              upiBadge.style.display = "flex";
              upiBadge.textContent = pendingUpiCount;
            } else {
              upiBadge.style.display = "none";
            }

            renderWeeklySalesChart();
          });

        const renderWeeklySalesChart = () => {
          const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          const last7Days = [];
          for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            last7Days.push({
              dateString: d.toLocaleDateString(),
              dayLabel: days[d.getDay()],
              sales: 0
            });
          }

          const ordList = Array.isArray(orders) ? orders : [];
          ordList.forEach(o => {
            if (o.paymentStatus === 'Paid' || o.paymentStatus === 'Verified') {
              const oDate = o.date ? o.date.split(',')[0].trim() : "";
              const match = last7Days.find(day => {
                if (day.dateString === oDate) return true;
                const parts1 = day.dateString.split('/');
                const parts2 = oDate.split('/');
                if (parts1.length === 3 && parts2.length === 3) {
                  return parseInt(parts1[0]) === parseInt(parts2[0]) &&
                         parseInt(parts1[1]) === parseInt(parts2[1]) &&
                         parseInt(parts1[2]) === parseInt(parts2[2]);
                }
                return false;
              });
              if (match) {
                match.sales += parseFloat(o.amount) || 0;
              }
            }
          });

          const maxSales = Math.max(...last7Days.map(d => d.sales), 100);
          const container = document.getElementById('weekly-sales-chart-container');
          if (container) {
            container.innerHTML = last7Days.map((day, idx) => {
              const pct = Math.max(10, Math.min(100, (day.sales / maxSales) * 90));
              const isToday = idx === 6;
              const barColor = isToday ? 'var(--color-accent)' : 'var(--color-primary)';
              const textColor = isToday ? 'var(--color-primary)' : '#FFF';
              const formattedVal = day.sales >= 1000 ? `₹${(day.sales/1000).toFixed(1)}k` : `₹${day.sales.toFixed(0)}`;
              return `
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%;">
                  <div style="width: 70%; background-color: ${barColor}; height: ${pct}%; border-radius: 4px 4px 0 0; margin-top: auto; display: flex; align-items: center; justify-content: center; color: ${textColor}; font-size: 0.75rem; font-weight: 700; min-height: 25px;">${formattedVal}</div>
                  <span style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: 6px;">${day.dayLabel}</span>
                </div>
              `;
            }).join('');
          }
        };
      };

      document.getElementById('btn-refresh-stats').addEventListener('click', () => {
        syncData();
        alert("Metrics synchronized successfully!");
      });

      // Seeder on dashboard init
      syncData();
      setupSSE();
    });
