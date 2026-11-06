/* About page: Filterable gallery with lightbox */

(function () {
  'use strict';

  var tiles = Array.from(
    document.querySelectorAll('.gallery-tile')
  );

  var filters = Array.from(
    document.querySelectorAll('.gallery-filter')
  );

  var box = document.getElementById('galleryLightbox');
  var count = document.querySelector('.gallery-count');

  // Check if gallery exists
  if (box === null) {
    return;
  }

  if (tiles.length === 0) {
    return;
  }

  // Lightbox elements
  var photo = box.querySelector('img');
  var caption = box.querySelector('figcaption');
  var closeBtn = box.querySelector('.lightbox-close');
  var prevBtn = box.querySelector('.lightbox-prev');
  var nextBtn = box.querySelector('.lightbox-next');

  // Check required elements individually
  if (photo === null) {
    return;
  }

  if (caption === null) {
    return;
  }

  if (closeBtn === null) {
    return;
  }

  if (prevBtn === null) {
    return;
  }

  if (nextBtn === null) {
    return;
  }

  // Gallery variables
  var visible = tiles.filter(function (tile) {
    return tile.hidden === false;
  });

  var index = 0;
  var lastFocus = null;
  var startX = null;

  // Show selected photograph
  function show(i) {
    if (visible.length === 0) {
      return;
    }

    index = (i + visible.length) % visible.length;

    var tile = visible[index];
    var galleryImage = tile.querySelector('img');

    if (galleryImage === null) {
      return;
    }

    // Open the same image shown in the gallery
    photo.src = galleryImage.currentSrc || galleryImage.src;

    // Use the visible gallery label as the single source of truth.
    // Editing .gallery-overlay text in about.html updates the lightbox too.
    var overlayLabel = tile.querySelector('.gallery-overlay span');
    var description = overlayLabel ? overlayLabel.textContent.trim() : '';

    if (!description) {
      description = galleryImage.alt || '';
    }

    photo.alt = galleryImage.alt || description;
    caption.textContent = description;
  }

  // Open the lightbox
  function open(tile) {
    visible = tiles.filter(function (t) {
      return t.hidden === false;
    });

    if (visible.length === 0) {
      return;
    }

    var selectedIndex = visible.indexOf(tile);

    if (selectedIndex === -1) {
      return;
    }

    lastFocus = document.activeElement;

    show(selectedIndex);

    var single = visible.length < 2;

    prevBtn.hidden = single;
    nextBtn.hidden = single;

    box.hidden = false;

    document.body.style.overflow = 'hidden';

    closeBtn.focus();
  }

  // Close the lightbox
  function close() {
    box.hidden = true;

    document.body.style.overflow = '';

    photo.removeAttribute('src');

    if (lastFocus !== null) {
      if (typeof lastFocus.focus === 'function') {
        lastFocus.focus();
      }
    }
  }

  // Gallery filters
  filters.forEach(function (button) {
    button.addEventListener('click', function () {
      var shown = 0;

      filters.forEach(function (filter) {
        var active = filter === button;

        filter.classList.toggle('active', active);

        filter.setAttribute(
          'aria-pressed',
          String(active)
        );
      });

      tiles.forEach(function (tile) {
        var matches = false;

        if (button.dataset.filter === 'all') {
          matches = true;
        } else if (
          tile.dataset.category === button.dataset.filter
        ) {
          matches = true;
        }

        tile.hidden = !matches;

        if (matches === true) {
          shown++;
        }
      });

      // Update gallery photograph count
      if (count !== null) {
        if (shown === 1) {
          count.textContent = shown + ' PHOTOGRAPH';
        } else {
          count.textContent = shown + ' PHOTOGRAPHS';
        }
      }
    });
  });

  // Open image when clicked
  tiles.forEach(function (tile) {
    tile.addEventListener('click', function () {
      open(tile);
    });
  });

  // Close button
  closeBtn.addEventListener('click', function () {
    close();
  });

  // Previous photograph
  prevBtn.addEventListener('click', function () {
    show(index - 1);
  });

  // Next photograph
  nextBtn.addEventListener('click', function () {
    show(index + 1);
  });
  // Close when background is clicked
  box.addEventListener('click', function (event) {
    if (event.target === box) {
      close();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function (event) {
    if (box.hidden === true) {
      return;
    }

    if (event.key === 'Escape') {
      close();
    } else if (event.key === 'ArrowRight') {
      if (visible.length > 1) {
        show(index + 1);
      }
    } else if (event.key === 'ArrowLeft') {
      if (visible.length > 1) {
        show(index - 1);
      }
    } else if (event.key === 'Tab') {
      var focusable = Array.from(
        box.querySelectorAll('button')
      ).filter(function (button) {
        if (button.hidden === true) {
          return false;
        }

        if (button.disabled === true) {
          return false;
        }

        return true;
      });

      if (focusable.length === 0) {
        return;
      }

      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (event.shiftKey === true) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
  });

  // Mobile swipe start
  box.addEventListener(
    'touchstart',
    function (event) {
      startX = event.changedTouches[0].clientX;
    },
    { passive: true }
  );

  // Mobile swipe end
  box.addEventListener(
    'touchend',
    function (event) {
      if (startX === null) {
        return;
      }

      var difference =
        event.changedTouches[0].clientX - startX;

      if (Math.abs(difference) > 50) {
        if (visible.length > 1) {
          if (difference < 0) {
            show(index + 1);
          } else {
            show(index - 1);
          }
        }
      }

      startX = null;
    },
    { passive: true }
  );

})();