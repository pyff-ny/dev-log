(function () {
  "use strict";
  var KEY = "devlog:readIds";

  function getReadIds() {
    try {
      return new Set(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch (e) {
      return new Set();
    }
  }

  function saveReadIds(ids) {
    localStorage.setItem(KEY, JSON.stringify(Array.from(ids)));
  }

  // Detail page: mark this case_id as read as soon as it's opened.
  var caseMetaEl = document.getElementById("case-meta");
  if (caseMetaEl) {
    try {
      var meta = JSON.parse(caseMetaEl.textContent);
      if (meta.case_id) {
        var readIds = getReadIds();
        readIds.add(meta.case_id);
        saveReadIds(readIds);
      }
    } catch (e) {
      // malformed meta — nothing to mark, nothing to crash
    }
  }

  // Home feed: unread dot on anything not in the read set. First visit
  // (empty set) means everything is unread.
  var entries = document.querySelectorAll(".entry");
  if (entries.length) {
    var seen = getReadIds();
    entries.forEach(function (el) {
      if (!seen.has(el.dataset.caseId)) {
        el.classList.add("is-unread");
      }
    });
  }

  // Activity heatmap: instant custom tooltip (bigger font than native
  // SVG <title>, no browser hover delay), positioned next to the cursor.
  var heatmapCells = document.querySelectorAll(".heatmap rect");
  if (heatmapCells.length) {
    var tip = document.createElement("div");
    tip.className = "heatmap-tip";
    tip.hidden = true;
    document.body.appendChild(tip);

    function positionTip(event) {
      var offset = 14;
      var x = event.clientX + offset;
      var y = event.clientY + offset;
      var maxX = window.innerWidth - tip.offsetWidth - offset;
      var maxY = window.innerHeight - tip.offsetHeight - offset;
      tip.style.left = Math.min(x, Math.max(offset, maxX)) + "px";
      tip.style.top = Math.min(y, Math.max(offset, maxY)) + "px";
    }

    heatmapCells.forEach(function (cell) {
      cell.addEventListener("mouseenter", function (event) {
        var date = cell.dataset.date;
        var count = cell.dataset.count;
        tip.textContent = date + "：" + count + " 条";
        tip.hidden = false;
        positionTip(event);
      });
      cell.addEventListener("mousemove", positionTip);
      cell.addEventListener("mouseleave", function () {
        tip.hidden = true;
      });
    });
  }

  // "全部" tab shows only the latest 10 entries by default; switching to a
  // category filter always shows that category in full (no 10-item cap).
  var COLLAPSE_COUNT = 10;
  var showMoreBtn = document.getElementById("show-more");

  function applyCollapse(collapsed) {
    entries.forEach(function (el, i) {
      el.style.display = collapsed && i >= COLLAPSE_COUNT ? "none" : "";
    });
    if (showMoreBtn) showMoreBtn.hidden = !collapsed;
  }

  if (showMoreBtn) {
    applyCollapse(true);
    showMoreBtn.addEventListener("click", function () {
      applyCollapse(false);
    });
  }

  var filterButtons = document.querySelectorAll("[data-filter-btn]");
  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.dataset.filterBtn;
      if (value === "all") {
        document.body.removeAttribute("data-filter");
        if (showMoreBtn) applyCollapse(true);
      } else {
        document.body.setAttribute("data-filter", value);
        applyCollapse(false);
      }
      filterButtons.forEach(function (b) {
        b.classList.toggle("active", b === btn);
      });
    });
  });
})();
