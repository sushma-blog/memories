"use strict";

// Call all functions
window.onload = function init() {
  applyFunction('.material-icons-outlined', materialIconSwitch);
  applyFunction('.full-height', fullHeight);
  applyFunction('.navigation', navigation);
  applyFunction('.sidemenu', sideMenuInit);
  applyFunction('footer', stickyFooter);
  applyFunction('[data-toggle-content]', toggleContent);
  applyFunction('[data-toggle-button-grp]', toggleBtnGroup);
  applyFunction('.tab-page', toggleBtnPrevNext);
  applyFunction('.tabs', tabArrows);
  applyFunction('.accordion', accordian);
  applyFunction('.snippet[data-toggle-button]', toggleBtnSingleTrigger);
  applyFunction('.sidenav-links', sideNav);
  applyFunction('.cards .cards-image', imgAutoResize, 'cover');
  applyFunction('.table-card', tableCards);
  applyFunction('.table', tableNoResult);
  applyFunction('.table-responsive', tableShadow);
  applyFunction('.needs-validation', formValidation);
  applyFunction('[data-char-left]', inputCharactersLeft);
  applyFunction('.password-visibility', inputShowPassword);
  applyFunction('[data-toggle-radio]', toggleRadio);
  applyFunction('[data-toggle-radio-grp]', toggleRadioGrp);
  applyFunction('[data-toggle-select]', toggleSelect);
  applyFunction('[data-duplicate-button]', duplicateItem);
  applyFunction('.upload-drag', uploadFile);
  applyFunction('.upload-file', uploadDeleteInit);
  watchForHover();
  applyFunction('a', emptyLinkVoid);
};
/*	================================================================================
		Accordian
=================================================================================	*/

/** Accordian:
 *  Call functions */


function accordian(accordion) {
  var button = accordion.querySelectorAll('[data-toggle-button]');
  var buttonLength = button.length;

  for (var i = 0; i < buttonLength; i++) {
    toggleAccordion(button[i], accordion.className.indexOf('accordion-grouped'), button);
  }
}
/** Accordian:
 *  Click to show or hide content  */


function toggleAccordion(button, isGrouped, sibling) {
  var target = button.parentNode.querySelector('[data-toggle-content]');
  var targetElems = targetFocusElems(target);
  var targetProps = toggleItemProperties(target);
  button.addEventListener('mouseup', function () {
    toggleAccordionAction(this, targetElems, targetProps, sibling, isGrouped);
  });
  button.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
      toggleAccordionAction(this, targetElems, targetProps, sibling, isGrouped);
    }
  });
}

function toggleAccordionAction(button, target, targetProps, sibling, isGrouped) {
  // Check if targeted content is hidden
  var targetHidden = target.self.getAttribute('aria-hidden');
  var siblingTarget, siblingTargetLength;

  switch (isGrouped) {
    case -1:
      // Targeted content is not in an accordion group
      toggleShowHide(button, targetHidden, target, targetProps, 'accordion');
      break;

    default:
      // Targeted content is in an accordion group
      siblingTarget = target.self.parentNode.parentNode.querySelectorAll('[data-toggle-content]');
      siblingTargetLength = siblingTarget.length; // Hide all content in the same group

      for (var i = 0; i < siblingTargetLength; i++) {
        sibling[i].setAttribute('aria-expanded', 'false');
        toggleHide(targetFocusElems(siblingTarget[i]));
      } // Show targeted content


      toggleShowHide(button, targetHidden, target, targetProps, 'accordion');
  }
}
/*	================================================================================
		Duplicatable element
=================================================================================	*/

/** Duplicatable element:
 *  Add duplicate function */


function duplicateItem(addButton) {
  var targetId = addButton.getAttribute('data-target');
  var target = document.getElementById(targetId);
  var targetHtml = target.outerHTML;
  var targetIdPos = targetHtml.lastIndexOf(targetId) + targetId.length;
  var targetParent = target.parentNode;
  var itemMin = parseInt(target.querySelector('[data-duplicate-counter]').textContent, 10) - 1;
  var itemMax = parseInt(target.getAttribute('data-max-item'), 10);

  if (!itemMax) {
    itemMax = 'unlimited';
  } // Click to duplicate item


  addButton.addEventListener('mouseup', function () {
    duplicateItemAction(itemMin, targetId, targetParent, targetHtml, targetIdPos, itemMax);
  });
  addButton.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
      duplicateItemAction(itemMin, targetId, targetParent, targetHtml, targetIdPos, itemMax);
    }
  });
}
/** Duplicatable element:
 *  Apply click function */


function duplicateItemAction(itemMin, targetId, targetParent, targetHtml, targetIdPos, itemMax) {
  var existingItems = targetParent.children; // Set item no. for element to be duplicated

  var itemNo = existingItems.length + 1 + itemMin; // Run only if maximum item limit is not reached

  if (itemMax === 'unlimited') {
    duplicateItemApply(itemNo, itemMin, targetId, targetParent, targetHtml, targetIdPos, existingItems);
  } else if (itemNo - itemMin - 1 < itemMax) {
    duplicateItemApply(itemNo, itemMin, targetId, targetParent, targetHtml, targetIdPos, existingItems);
  } // Reset item no


  itemNo = 0;
}

function duplicateItemApply(itemNo, itemMin, targetId, targetParent, targetHtml, targetIdPos, existingItems) {
  var targetNew, targetTitleNew, targetRemoveHtml, targetRemoveHtmlLength, targetElems; // Duplicate and insert element

  targetParent.insertAdjacentHTML('beforeend', [targetHtml.slice(0, targetIdPos), itemNo, targetHtml.slice(targetIdPos)].join('')); // Select the duplicated element

  targetNew = document.getElementById(targetId + itemNo); // Remove unwanted elements in duplicated element

  targetRemoveHtml = targetNew.querySelectorAll('[data-duplicate-remove]');
  targetRemoveHtmlLength = targetRemoveHtml.length;

  for (var i = 0; i < targetRemoveHtmlLength; i++) {
    targetRemoveHtml[i].parentNode.removeChild(targetRemoveHtml[i]);
  }

  targetElems = targetFocusElems(targetNew);
  targetFocusShow(targetElems); // Focus on first input field

  if (targetElems.input[0]) {
    targetElems.input[0].focus();
  } // Clear input fields


  for (var _i = 0; _i < targetElems.input.length; _i++) {
    targetElems.input[_i].value = '';
  } // Insert item no. for the duplicated element


  targetNew.querySelector('[data-duplicate-counter]').textContent = itemNo; // Select title of the duplicated element

  targetTitleNew = targetNew.querySelector('.duplicate-title');

  if (targetTitleNew) {
    // Duplicated element has title
    duplicateDeleteBtnAdd(existingItems[0], targetNew, existingItems[0].querySelector('.duplicate-title'), targetTitleNew, targetId, targetParent, itemMin, '<button type="button" class="duplicate-delete-btn" aria-label="Delete"></button>', '.duplicate-delete-btn');
  } else {
    // Duplicated element has no title
    if (targetNew.querySelector('.input-group')) {
      // Duplicated element is a input-group
      duplicateDeleteBtnAdd(existingItems[0], targetNew, existingItems[0].querySelector('.input-group'), targetNew.querySelector('.input-group'), targetId, targetParent, itemMin, '<button type="button" class="duplicate-delete-btn-input" aria-label="Delete"></button>', '.duplicate-delete-btn-input');
    } else {
      // Duplicated element is not a input-group
      duplicateDeleteBtnAdd(existingItems[0], targetNew, targetParent, targetParent, targetId, targetParent, itemMin, '<button type="button" class="duplicate-delete-btn-full" aria-label="Delete"></button>', '.duplicate-delete-btn-full');
    }

    existingItems[0].id = targetId;
  } // Call flatpickr plugin


  addFlatpickr(targetNew, '.form-date');
}
/** Duplicatable element:
 *  Insert delete button */


function duplicateDeleteBtnAdd(target, targetNew, targetTitle, targetTitleNew, targetId, targetParent, itemMin, deleteBtnHtml, deleteBtnName) {
  if (targetParent.children.length === 2) {
    duplicateDeleteBtnApply(target, targetTitle, targetId, targetParent, itemMin, deleteBtnHtml, deleteBtnName);
  }

  duplicateDeleteBtnApply(targetNew, targetTitleNew, targetId, targetParent, itemMin, deleteBtnHtml, deleteBtnName);
}

function duplicateDeleteBtnApply(target, targetTitle, targetId, targetParent, itemMin, deleteBtnHtml, deleteBtnName) {
  targetTitle.insertAdjacentHTML('beforeend', deleteBtnHtml);
  duplicateDelete(target.querySelector(deleteBtnName), target, targetId, targetParent, itemMin, deleteBtnName);
}
/** Duplicatable element:
 *  Delete duplicated element */


function duplicateDelete(item, target, targetId, parent, itemMin, deleteBtnName) {
  item.addEventListener('mouseup', function () {
    duplicateDeleteAction(target, targetId, parent, itemMin, deleteBtnName);
  });
  item.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
      duplicateDeleteAction(target, targetId, parent, itemMin, deleteBtnName);
    }
  });
}

function duplicateDeleteAction(target, targetId, parent, itemMin, deleteBtnName) {
  var existingItems, existingItemsLength, deleteBtn, input; /// Delete target

  parent.removeChild(target); // Select all remaining items

  existingItems = parent.children;
  existingItemsLength = existingItems.length; // Remove delete button if there is only one item

  if (existingItemsLength <= 1) {
    deleteBtn = existingItems[0].querySelector(deleteBtnName);

    if (deleteBtn) {
      deleteBtn.remove();
    }

    input = existingItems[0].querySelector('INPUT');

    if (input.value === '') {
      input.focus();
    } else {
      document.querySelector('[data-target="' + targetId + '"]').focus();
    }
  } else {
    input = existingItems[existingItems.length - 1].querySelector('INPUT');

    if (input) {
      input.focus();
    }
  } // Reset counter no. for each remaining items


  for (var i = 0; i < existingItemsLength; i++) {
    if (i > 0) {
      existingItems[i].id = targetId + (i + 1 + itemMin);
    } else {
      existingItems[i].id = targetId;
    }

    existingItems[i].querySelector('[data-duplicate-counter]').textContent = i + 1 + itemMin;
  }
}
/** Duplicatable element:
 *  Call flatpickr plugin */


function addFlatpickr(item, itemName) {
  var datePicker = item.querySelectorAll(itemName);
  var datePickerLength = datePicker.length;
  var datePickerName = itemName.replace('.', '');
  var datePickerSibling;

  switch (datePickerLength) {
    case 0:
      break;

    case 1:
      dateInputFormat(datePicker[0]);
      flatpickr(datePicker[0], {
        dateFormat: 'd/m/Y',
        allowInput: 'true'
      });
      break;

    default:
      for (var a = 0; a < datePickerLength; a++) {
        datePickerSibling = datePicker[a].nextElementSibling;

        if (datePickerSibling) {
          if (datePickerSibling.className.indexOf(datePickerName) !== -1) {
            datePickerSibling.parentNode.removeChild(datePickerSibling);
          }
        }
      }

      datePicker = item.querySelectorAll(itemName);
      datePickerLength = datePicker.length;

      for (var b = 0; b < datePickerLength; b++) {
        removeClassName(datePicker[b], 'flatpickr-input');
        removeClassName(datePicker[b], 'flatpickr-mobile');
        datePicker[b].removeAttribute('step');
        datePicker[b].removeAttribute('tabindex');
        datePicker[b].setAttribute('type', 'text');
        datePicker[b].setAttribute('pattern', '(0[1-9]|[12][0-9]|3[01])+[\-\/](0[1-9]|1[012])+[\-\/](19|20)\d\d');
        dateInputFormat(datePicker[b]);
        flatpickr(datePicker[b], {
          dateFormat: 'd/m/Y',
          allowInput: 'true'
        });
      }

  }
}
/** Duplicatable element:
 *  Date input characters allowed */


function dateInputFormat(item) {
  var ctrlKey;
  item.addEventListener('keyup', function () {
    ctrlKey = '';
  });
  item.addEventListener('keydown', function (e) {
    if (e.key === 'Control' || e.key === 'Meta') {
      ctrlKey = 'true';
    }

    switch (true) {
      case ctrlKey === 'true' && e.key === 'r':
      case ctrlKey === 'true' && e.key === 'R':
      case ctrlKey === 'true' && e.key === 'c':
      case ctrlKey === 'true' && e.key === 'C':
      case ctrlKey === 'true' && e.key === 'v':
      case ctrlKey === 'true' && e.key === 'V':
      case e.key === 'Enter':
      case e.key === 'Delete':
      case e.key === 'Backspace':
      case e.key === 'ArrowUp':
      case e.key === 'ArrowDown':
      case e.key === 'ArrowLeft':
      case e.key === 'ArrowRight':
      case e.key === 'Tab':
      case e.key === '0':
      case e.key === '1':
      case e.key === '2':
      case e.key === '3':
      case e.key === '4':
      case e.key === '5':
      case e.key === '6':
      case e.key === '7':
      case e.key === '8':
      case e.key === '9':
      case e.key === '-':
      case e.key === '/':
        break;

      default:
        e.preventDefault();
    }
  });
}
/*	================================================================================
		Footer
=================================================================================	*/

/** Sticky footer:
 *  Call functions */


function stickyFooter(footer) {
  var fullHeightElem = document.querySelector('.full-height');
  var navBar = document.querySelector('.navigation');
  var contentArea = document.querySelector('.content-area'); // Fire on load

  stickyFooterResize(footer, fullHeightElem, navBar, contentArea); // Fire when window resizes

  window.addEventListener('resize', function () {
    stickyFooterResize(footer, fullHeightElem, navBar, contentArea);
  });
}
/** Sticky footer:
 *  Resize function */


function stickyFooterResize(footer, fullHeightElem, navBar, contentArea) {
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var contentAreaHeight = stickyFooterContentHeight(navBar, contentArea);
  var copyright = footer.querySelector('.footer-copyright');
  var copyrightVal;
  var lastPos;
  var brPos; // Set footer to fixed or relative

  if (contentAreaHeight + footer.offsetHeight < windowHeight && !fullHeightElem) {
    footer.setAttribute('data-position', 'fixed');
  } else {
    footer.setAttribute('data-position', 'relative');
  } // Copyright text to appear as two lines on smaller screens


  if (copyright) {
    copyrightVal = copyright.innerHTML;
    lastPos = copyrightVal.indexOf('Last');
    brPos = copyrightVal.indexOf('<br>');

    if (windowWidth < 992) {
      if (lastPos !== -1 && brPos === -1) {
        copyrightVal = [copyrightVal.slice(0, lastPos), '<br>', copyrightVal.slice(lastPos)].join('');
      }
    } else {
      if (brPos !== -1) {
        copyrightVal = copyrightVal.replace('<br>', '');
      }
    }

    copyright.innerHTML = copyrightVal;
  }
}
/** Sticky footer:
 *  Get height of content area */


function stickyFooterContentHeight(navBar, contentArea) {
  if (contentArea) {
    if (navBar) {
      // For navbar that position is not fixed
      return contentArea.offsetHeight + navBar.offsetHeight;
    } else {
      return contentArea.offsetHeight;
    }
  }
}
/*	================================================================================
		Input: Show password
=================================================================================	*/


function inputShowPassword(button) {
  var input = button.parentNode.querySelector('input');
  button.addEventListener('mouseup', function () {
    inputShowPasswordAction(input, this);
  });
  button.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
      inputShowPasswordAction(input, this);
    }
  });
}

function inputShowPasswordAction(input, button) {
  switch (input.getAttribute('type')) {
    case 'password':
      input.setAttribute('type', 'text');
      button.setAttribute('aria-selected', 'true');
      break;

    case 'text':
      input.setAttribute('type', 'password');
      button.setAttribute('aria-selected', 'false');
      break;
  }
}
/*	================================================================================
		Toggle: Radio
=================================================================================	*/


function toggleRadio(radio) {
  var target = document.getElementById(radio.getAttribute('data-target'));
  var targetElems = targetFocusElems(target);
  var sibling = document.querySelectorAll('[name="' + radio.getAttribute('name') + '"]');
  var siblingLength = sibling.length; // Hide content if 'off' is selected

  for (var i = 0; i < siblingLength; i++) {
    if (sibling[i].checked === true) {
      if (sibling[i].getAttribute('data-switch') === 'off') {
        toggleRadioHide(targetElems);
      } else {
        toggleRadioShow(targetElems);
      }
    }
  } // Hide or show content depending on which option is selected


  switch (radio.getAttribute('data-switch')) {
    case 'on':
      // Toggle radio to show content
      radio.addEventListener('change', function () {
        if (this.checked === true) {
          toggleRadioShow(targetElems);
        }
      });
      break;

    case 'off':
      // Toggle radio to hide content
      radio.addEventListener('change', function () {
        if (this.checked === true) {
          toggleRadioHide(targetElems);
        }
      });
      break;
  }
}
/*	================================================================================
		Toggle: Radio group
=================================================================================	*/


function toggleRadioGrp(radio) {
  var target = document.getElementById(radio.getAttribute('data-target'));
  var targetElems = targetFocusElems(target);
  var sibling = document.querySelectorAll('[name="' + radio.getAttribute('name') + '"]');
  var siblingLength = sibling.length;
  var siblingElems; // Hide or show content depending on which option is selected

  for (var a = 0; a < siblingLength; a++) {
    siblingElems = targetFocusElems(document.getElementById(sibling[a].getAttribute('data-target')));

    if (sibling[a].checked === true) {
      toggleRadioShow(siblingElems);
    } else {
      toggleRadioHide(siblingElems);
    }
  } // Hide or show content depending on which option is selected


  radio.addEventListener('change', function () {
    if (this.checked === true) {
      for (var b = 0; b < siblingLength; b++) {
        siblingElems = targetFocusElems(document.getElementById(sibling[b].getAttribute('data-target')));
        toggleRadioHide(siblingElems);
      }

      toggleRadioShow(targetElems);
    }
  });
}
/*	================================================================================
		Toggle: Select
=================================================================================	*/


function toggleSelect(select) {
  var option = select.options;
  var optionLength = option.length;
  var optionSelected = select.selectedIndex; // Show content of the option that is selected

  toggleSelectShow(option, optionLength, optionSelected); // Show content of the option that is selected

  select.addEventListener('change', function () {
    optionSelected = select.selectedIndex;
    toggleSelectShow(option, optionLength, optionSelected);
  });
}

function toggleSelectShow(option, optionLength, optionSelected) {
  var target, targetElems;

  for (var i = 0; i < optionLength; i++) {
    if (option[i].getAttribute('disabled') !== 'disabled' && option[i].getAttribute('data-target')) {
      target = document.getElementById(option[i].getAttribute('data-target'));
      targetElems = targetFocusElems(target);

      if (i === optionSelected) {
        toggleRadioShow(targetElems);
      } else {
        toggleRadioHide(targetElems);
      }
    }
  }
}
/*	================================================================================
	Toggle: Radio / Select (reusable)
=================================================================================	*/
// Show target


function toggleRadioShow(target) {
  target.self.setAttribute('aria-hidden', 'false');
  targetFocusShow(target);
  applyFunction('footer', stickyFooter);

  if (target.input[0]) {
    target.input[0].focus();
  }
} // Hide target


function toggleRadioHide(target) {
  target.self.setAttribute('aria-hidden', 'true');
  targetFocusHide(target);
  applyFunction('footer', stickyFooter);
}
/*	================================================================================
		Form validation
=================================================================================	*/


function formValidation(item) {
  item.addEventListener('submit', function (e) {
    if (this.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    addClassName(this, 'was-validated');
  });
}
/*	================================================================================
		Input: Characters left
=================================================================================	*/


function inputCharactersLeft(item) {
  var input = item.previousElementSibling;
  var maxValue = item.querySelector('.max-value');
  var currValue = item.querySelector('.curr-value');
  var maxValueSetting;

  if (input) {
    maxValueSetting = parseInt(input.getAttribute('maxlength'), 10);

    if (maxValue) {
      maxValue.textContent = maxValueSetting;
    }

    if (currValue) {
      currValue.textContent = maxValueSetting - input.value.length;
    }

    input.addEventListener('keyup', function () {
      currValue.textContent = maxValueSetting - this.value.length;
    });
  }
}
/*	================================================================================
		Full height
=================================================================================	*/


function fullHeight(item) {
  var navBar = document.querySelector('body > .navigation');
  var footer = document.querySelector('body > footer');
  var navHeight = 0;
  var footerHeight = 0;
  var windowHeight;
  var itemHeight;
  fullHeightApply(item, navBar, navHeight, footer, footerHeight, windowHeight, itemHeight);
  window.addEventListener('resize', function () {
    fullHeightApply(item, navBar, navHeight, footer, footerHeight, windowHeight, itemHeight);
  });
}

function fullHeightApply(item, navBar, navHeight, footer, footerHeight, windowHeight, itemHeight) {
  windowHeight = window.innerHeight;

  if (navBar) {
    navHeight = navBar.offsetHeight;
  }

  if (footer) {
    footerHeight = footer.offsetHeight;
  }

  switch (true) {
    case footer === null && navBar === null:
      itemHeight = windowHeight;
      break;

    case footer === null && navBar !== null:
      itemHeight = windowHeight - navHeight;
      break;

    case footer !== null && navBar === null:
      itemHeight = windowHeight - footerHeight;
      break;

    default:
      itemHeight = windowHeight - footerHeight - navHeight;
  }

  item.style.minHeight = itemHeight + 'px';
}
/*	================================================================================
		Navigation
=================================================================================	*/


function navigation(navBar) {
  var isFullWidth = navBar.className.indexOf('full');
  var links = navBar.querySelector('.nav-links');
  var linksElems;
  var logo = navBar.querySelector('.nav-logo');
  var hamburgerMenu = navBar.querySelector('.nav-menu-btn');
  var iconButton = navBar.querySelectorAll('.nav-icon-btn');
  var iconButtonLength = iconButton.length;
  var iconContent = navBar.querySelectorAll('.nav-btn-content');
  var iconContentLength = iconContent.length;
  var searchButton = navBar.querySelector('.nav-search-btn');
  var searchContent = navBar.querySelector('.nav-search-content');
  var userButton = navBar.querySelector('.nav-user-btn');
  var userContent = navBar.querySelector('.nav-user-content');
  var expandableLink;
  var expandableLinkLength;
  var expandableLinkChildren;
  var firstLevelLink = [];
  var firstLevelLinkLength;
  var subMenu = [];
  var subMenuLength;
  var subMenuLink = [];
  var subMenuLinkLength;
  var megaMenu = [];
  var megaMenuLength;
  var megaMenuImage = navBar.querySelectorAll('.mega-image');
  var megaMenuImageLength = megaMenuImage.length;
  var sideMenu = document.querySelector('.sidemenu');
  var sideMenuShowBtn = document.querySelector('.sidemenu .show-menu-btn'); // Hide navigation bar if scrolled up

  navScrollHide(navBar);

  for (var d = 0; d < megaMenuImageLength; d++) {
    imgAutoResize(megaMenuImage[d], 'cover');
  }

  if (logo) {
    imgAutoResize(logo);
  }

  if (userButton) {
    getItemHeight(userContent);
    navBtnOutsideClose(userButton, userContent, sideMenu, sideMenuShowBtn);
  }

  if (searchButton) {
    getItemHeight(searchContent);
    inputClear(searchContent);
    navBtnOutsideClose(searchButton, searchContent, sideMenu, sideMenuShowBtn);
  } // Run if only there are links


  if (links) {
    linksElems = targetFocusElems(links);
    expandableLink = links.querySelectorAll('.multi-level');
    expandableLinkLength = expandableLink.length;

    for (var f = 0; f < expandableLinkLength; f++) {
      // Get first level links
      if (expandableLink[f].className.indexOf('first') !== -1) {
        firstLevelLink.push(expandableLink[f]);
      } // Get mega menus


      if (expandableLink[f].className.indexOf('mega') !== -1) {
        megaMenu.push(expandableLink[f]);
      }

      expandableLinkChildren = expandableLink[f].children;

      for (var g = 0; g < expandableLinkChildren.length; g++) {
        // Get sub menus
        if (expandableLinkChildren[g].className.indexOf('sub-menu') !== -1) {
          subMenu.push(expandableLinkChildren[g]);
        } // Get expandable links direct link


        if (expandableLinkChildren[g].tagName === 'A') {
          subMenuLink.push(expandableLinkChildren[g]);
        }
      }
    }

    firstLevelLinkLength = firstLevelLink.length;
    megaMenuLength = megaMenu.length;
    subMenuLength = subMenu.length;
    subMenuLinkLength = subMenuLink.length;

    if (hamburgerMenu) {
      navMenuClick(hamburgerMenu, links, linksElems, iconContent, iconContentLength, iconButton, iconButtonLength, subMenuLink, subMenuLinkLength, subMenu, subMenuLength, sideMenu, sideMenuShowBtn);
    } // Get submenus height


    navSubmenuHeight(subMenu, subMenuLength); // Update values when resized

    navResize(links, linksElems, subMenuLink, subMenuLinkLength, subMenu, subMenuLength, sideMenu, sideMenuShowBtn, hamburgerMenu, megaMenu, megaMenuLength, isFullWidth); // Hover to expand first level menu

    for (var a = 0; a < firstLevelLinkLength; a++) {
      linksMouseEnter(firstLevelLink[a], iconContent, iconContentLength, iconButton, iconButtonLength, subMenuLink, subMenuLinkLength, megaMenu, firstLevelLink[a].querySelector('.sub-menu'), firstLevelLink[a].querySelector('a'), subMenu, subMenuLength);
    } // Click to expand submenu


    for (var b = 0; b < expandableLinkLength; b++) {
      linksClick(expandableLink[b].querySelector('a'), expandableLink[b].querySelector('.sub-menu'));
    }
  } //Call function: Navigation buttons (if it's not the hamburger menu)


  for (var c = 0; c < iconButtonLength; c++) {
    if (iconButton[c] !== hamburgerMenu) {
      navBtnClick(iconButton[c], iconContent, iconContentLength, iconButton, iconButtonLength, links, linksElems, subMenuLink, subMenuLinkLength, subMenu, subMenuLength, sideMenu, sideMenuShowBtn);
    }
  }
}
/*	================================================================================
		Navigation bar: Hide navigation bar if scrolled up
=================================================================================	*/


function navScrollHide(navigation) {
  var navHeight = navigation.offsetHeight;
  var scrolled = window.pageYOffset;
  var currScrolled;
  window.addEventListener('resize', function () {
    navHeight = navigation.offsetHeight;
  });
  window.addEventListener('scroll', function () {
    currScrolled = window.pageYOffset;

    if (scrolled > navHeight) {
      if (currScrolled > scrolled) {
        navigation.setAttribute('data-scrolled', 'true');
      } else {
        navigation.setAttribute('data-scrolled', 'false');
      }
    } else {
      navigation.setAttribute('data-scrolled', 'false');
    }

    scrolled = currScrolled;
  });
}
/*	================================================================================
		Navigation bar: Update values when window resizes
=================================================================================	*/


function navResize(links, linksElems, subMenuLink, subMenuLinkLength, subMenu, subMenuLength, sideMenu, sideMenuShowBtn, hamburgerMenu, megaMenu, megaMenuLength, isFullWidth) {
  var windowWidth = window.innerWidth;

  switch (true) {
    case windowWidth < 992:
      //Hide parent menu
      links.setAttribute('aria-hidden', 'true');
      targetFocusHide(linksElems); //Enable tab for hamburger menu

      removeTabIndex(hamburgerMenu); //Hide sub-menus

      navSubmenuHide(subMenu, subMenuLength);
      break;

    case windowWidth >= 992:
      //Show parent menu
      links.setAttribute('aria-hidden', 'false');
      targetFocusShow(linksElems); //Disable tab for hamburger menu

      setTabIndex(hamburgerMenu, '-1'); //Reset direction of arrows to default

      navMenuIcoReset180(subMenuLink, subMenuLinkLength); //Hide sub-menus

      navSubmenuHide(subMenu, subMenuLength);
      break;
  } //Mega menu padding


  navMegaMenuPadding(megaMenu, megaMenuLength, windowWidth, isFullWidth);
  window.addEventListener('resize', function () {
    windowWidth = window.innerWidth;

    switch (true) {
      case windowWidth < 992:
        //Hide navigation menu if it's not open
        if (links.getAttribute('aria-hidden') === 'false') {
          links.setAttribute('aria-hidden', 'true');
          targetFocusHide(linksElems);
        } //Enable tab for hamburger menu


        removeTabIndex(hamburgerMenu);
        break;

      case windowWidth >= 992:
        //Show navigation menu
        document.body.removeAttribute('style');
        links.setAttribute('aria-hidden', 'false');
        targetFocusShow(linksElems); //Disable tab for hamburger menu

        setTabIndex(hamburgerMenu, '-1'); //Reset direction of arrows to default

        navMenuIcoReset180(subMenuLink, subMenuLinkLength); //Hide sub-menus

        navSubmenuHide(subMenu, subMenuLength); //Switch icon of burger menu from 'X' to original

        hamburgerMenu.setAttribute('aria-expanded', 'false'); //Hide side-menu's show button (side-menu is open on default on larger screen size)

        sideMenuShowBtnHide(sideMenu, sideMenuShowBtn); //Mega menu padding

        navMegaMenuPadding(megaMenu, megaMenuLength, windowWidth, isFullWidth);
        break;
    }
  });
}

function navMegaMenuPadding(links, linksLength, windowWidth, isFullWidth) {
  var menuPadding;
  var menu;

  if (isFullWidth === -1) {
    if (windowWidth >= 1152) {
      menuPadding = (windowWidth - 1200) / 2;

      for (var i = 0; i < linksLength; i++) {
        menu = links[i].querySelector('.sub-menu');

        if (menu) {
          menu.setAttribute('style', 'padding-left: ' + menuPadding + 'px; padding-right: ' + menuPadding + 'px');
        }
      }
    } else {
      for (var a = 0; a < linksLength; a++) {
        menu = links[a].querySelector('.sub-menu');

        if (menu) {
          menu.removeAttribute('style');
        }
      }
    }
  }
}
/*	================================================================================
		Navigation bar: Find the height of each link
=================================================================================	*/


function navSubmenuHeight(menu, menuLength) {
  navSubmenuHeightApply(menu, menuLength);
  window.addEventListener('resize', function () {
    navSubmenuHeightApply(menu, menuLength);
  });
}

function navSubmenuHeightApply(menu, menuLength) {
  var isHidden;
  var submenu;
  var submenuLength;
  var submenuIsHidden;
  var totalHeight;

  for (var a = 0; a < menuLength; a++) {
    isHidden = menu[a].getAttribute('aria-hidden');
    submenu = menu[a].querySelectorAll('.sub-menu');
    submenuLength = submenu.length; // Unhide menu

    if (isHidden === 'true') {
      menu[a].setAttribute('aria-hidden', 'false');
    } // Get menu's height


    menu[a].style.maxHeight = 'none';
    totalHeight = menu[a].offsetHeight;

    for (var b = 0; b < submenuLength; b++) {
      submenuIsHidden = submenu[b].getAttribute('aria-hidden'); // Unhide submenu

      if (isHidden === 'true') {
        submenu[b].setAttribute('aria-hidden', 'false');
      } // Get submenu's height


      submenu[b].style.maxHeight = 'none';
      totalHeight += submenu[b].offsetHeight; // Hide submenu if it's hidden initially

      if (isHidden === 'true') {
        submenu[b].setAttribute('aria-hidden', 'true');
        submenu[b].style.maxHeight = '0';
      }
    } // Hide menu if it's hidden initially


    if (isHidden === 'true') {
      menu[a].setAttribute('aria-hidden', 'true');
      menu[a].style.maxHeight = '0';
    } // Set menu's height


    menu[a].setAttribute('data-height', totalHeight);
  }
}
/*	================================================================================
		Navigation buttons
=================================================================================	*/

/** Navigation buttons:
 *  Click to show or hide content (search, settings etc...) */


function navBtnClick(button, siblingContent, siblingContentLength, siblingButton, siblingButtonLength, links, linksElems, subLinks, subLinksLength, subMenu, subMenuLength, sideMenu, sideMenuShowBtn) {
  var content = button.nextElementSibling;
  var contentElems = targetFocusElems(content);
  var isHidden; // Check for disabled form elements

  targetFocusDisabledCheck(contentElems);
  button.addEventListener('mouseup', function () {
    navBtnClickAction(this, content, contentElems, siblingContent, siblingContentLength, siblingButton, siblingButtonLength, links, linksElems, subLinks, subLinksLength, subMenu, subMenuLength, sideMenu, sideMenuShowBtn);
  });
  button.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
      navBtnClickAction(this, content, contentElems, siblingContent, siblingContentLength, siblingButton, siblingButtonLength, links, linksElems, subLinks, subLinksLength, subMenu, subMenuLength, sideMenu, sideMenuShowBtn);
    }
  });
  button.addEventListener('focus', function () {
    isHidden = content.getAttribute('aria-hidden'); //Hide navgation menu

    if (links && window.innerWidth < 992) {
      //Hide parent menu
      document.body.removeAttribute('style');
      links.setAttribute('aria-hidden', 'true');
      targetFocusHide(linksElems); //Reset direction of arrows to default

      navMenuIcoReset180(subLinks, subLinksLength); //Hide sub-menus

      navSubmenuHide(subMenu, subMenuLength);
    }

    navSiblingContentHide(siblingContent, siblingContentLength, siblingButton, siblingButtonLength);

    if (isHidden === 'false') {
      navBtnContentShow(button, content, contentElems, siblingContent, siblingContentLength, siblingButton, siblingButtonLength);
    } else {
      sideMenuShowBtnShow(sideMenu, sideMenuShowBtn);
    }
  });
}

function navBtnClickAction(button, content, contentElems, siblingContent, siblingContentLength, siblingButton, siblingButtonLength, links, linksElems, subLinks, subLinksLength, subMenu, subMenuLength, sideMenu, sideMenuShowBtn) {
  //Hide navgation menu
  if (links && window.innerWidth < 992) {
    //Hide parent menu
    document.body.removeAttribute('style');
    links.setAttribute('aria-hidden', 'true');
    targetFocusHide(linksElems); //Reset direction of arrows to default

    navMenuIcoReset180(subLinks, subLinksLength); //Hide sub-menus

    navSubmenuHide(subMenu, subMenuLength);
  } //Hide or show own's content


  switch (content.getAttribute('aria-hidden')) {
    case 'true':
      navBtnContentShow(button, content, contentElems, siblingContent, siblingContentLength, siblingButton, siblingButtonLength, sideMenu, sideMenuShowBtn);
      break;

    default:
      navBtnContentHide(button, content, contentElems, sideMenu, sideMenuShowBtn);
  }
}
/** Navigation buttons:
 *  Hide content if click outside */


function navBtnOutsideClose(button, content, sideMenu, sideMenuShowBtn) {
  var clickedcontent;
  document.addEventListener('mouseup', function (e) {
    if (content) {
      clickedcontent = e.target;

      if (clickedcontent !== content && clickedcontent !== button && clickedcontent.parentNode !== content && clickedcontent.parentNode !== button && clickedcontent.parentNode.parentNode !== content && clickedcontent.parentNode.parentNode !== button && content.getAttribute('aria-hidden') === 'false') {
        navBtnContentHide(button, content, targetFocusElems(content), sideMenu, sideMenuShowBtn);
      }
    }
  });
}
/** Navigation buttons:
 *  Reusable function */


function navBtnContentShow(button, content, contentElems, siblingContent, siblingContentLength, siblingButton, siblingButtonLength, sideMenu, sideMenuShowBtn) {
  //Hide content of other navigation item
  navSiblingContentHide(siblingContent, siblingContentLength, siblingButton, siblingButtonLength); //Show own's content

  content.setAttribute('aria-hidden', 'false');
  content.setAttribute('style', 'max-height: ' + content.getAttribute('data-height')); //Enable tab on own's content

  targetFocusShow(contentElems); //Auto-focuses on first input field if exists

  /*if ( contentElems.input[0] ) {
  	contentElems.input[0].focus();
  }*/
  //Switch own's icon to 'X'

  button.setAttribute('aria-expanded', 'true'); //Hide side-menu's show button

  sideMenuShowBtnHide(sideMenu, sideMenuShowBtn);
}

function navBtnContentHide(button, content, contentElems, sideMenu, sideMenuShowBtn) {
  //Hide own's content
  content.setAttribute('aria-hidden', 'true');
  content.removeAttribute('style'); //Disable tab on own's content

  targetFocusHide(contentElems); //Switch own's icon from 'X' to original

  button.setAttribute('aria-expanded', 'false'); //Show side-menu's show button

  sideMenuShowBtnShow(sideMenu, sideMenuShowBtn);
}
/*	================================================================================
		Navigation menu
=================================================================================	*/

/** Navigation menu:
 *  Click to open */


function navMenuClick(button, content, contentElems, siblingContent, siblingContentLength, siblingButton, siblingButtonLength, subLinks, subLinksLength, subMenu, subMenuLength, sideMenu, sideMenuShowBtn) {
  var isHidden;
  button.addEventListener('mouseup', function () {
    navMenuClickAction(button, content, contentElems, siblingContent, siblingContentLength, siblingButton, siblingButtonLength, subLinks, subLinksLength, subMenu, subMenuLength, sideMenu, sideMenuShowBtn);
  });
  button.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
      navMenuClickAction(button, content, contentElems, siblingContent, siblingContentLength, siblingButton, siblingButtonLength, subLinks, subLinksLength, subMenu, subMenuLength, sideMenu, sideMenuShowBtn);
    }
  });
  button.addEventListener('focus', function () {
    navSiblingContentHide(siblingContent, siblingContentLength, siblingButton, siblingButtonLength);
  });
}

function navMenuClickAction(button, content, contentElems, siblingContent, siblingContentLength, siblingButton, siblingButtonLength, subLinks, subLinksLength, subMenu, subMenuLength, sideMenu, sideMenuShowBtn) {
  switch (content.getAttribute('aria-hidden')) {
    case 'true':
      //Show navigation menu
      navMenuContentShow(button, content, contentElems, siblingContent, siblingContentLength, siblingButton, siblingButtonLength, subMenu, subMenuLength, sideMenu, sideMenuShowBtn);
      break;

    case 'false':
      //Hide navigation menu
      navMenuContentHide(button, content, contentElems, subLinks, subLinksLength, subMenu, subMenuLength, sideMenu, sideMenuShowBtn);
      break;
  }
}
/** Navigation menu:
 *  Reusable function */


function navMenuContentShow(button, content, contentElems, siblingContent, siblingContentLength, siblingButton, siblingButtonLength, subMenu, subMenuLength, sideMenu, sideMenuShowBtn) {
  //Hide content of other navigation item
  navSiblingContentHide(siblingContent, siblingContentLength, siblingButton, siblingButtonLength); //Show navigation menu

  document.body.style.overflow = 'hidden';
  content.setAttribute('aria-hidden', 'false'); //Switch icon of burger menu from original to 'X'

  button.setAttribute('aria-expanded', 'true'); //Enable tab on own's content

  targetFocusShow(contentElems); //Focus on first link

  if (contentElems.link[0]) {
    contentElems.link[0].focus();
  } //Hide sub-menus


  navSubmenuHide(subMenu, subMenuLength); //Hide side-menu's show button (to prevent overlapping)

  sideMenuShowBtnHide(sideMenu, sideMenuShowBtn);
}

function navMenuContentHide(button, content, contentElems, subLinks, subLinksLength, subMenu, subMenuLength, sideMenu, sideMenuShowBtn) {
  //Hide navigation menu
  document.body.removeAttribute('style');
  content.setAttribute('aria-hidden', 'true'); //Reset direction of arrows to default

  navMenuIcoReset180(subLinks, subLinksLength); //Hide sub-menus

  navSubmenuHide(subMenu, subMenuLength); //Switch icon of burger menu from 'X' to original

  button.setAttribute('aria-expanded', 'false'); //Disable tab on own's content

  targetFocusHide(contentElems); //Show side-menu's show button

  sideMenuShowBtnShow(sideMenu, sideMenuShowBtn);
}
/*	================================================================================
		Navigation bar: Sub-level - Call mouse functions
=================================================================================	*/
//Sub-level - Collapses when mouse leaves
//Sub-level - Expands when mouse enter


function linksMouseEnter(item, iconBtnContent, iconBtnContentLength, iconBtn, iconBtnLength, linksMultiLink, linksMultiLinkLength, megaMenu, submenu, link, linksMultiMenu, linksMultiMenuLength) {
  item.addEventListener('mouseenter', function () {
    linksMouseEnterAction(item, iconBtnContent, iconBtnContentLength, iconBtn, iconBtnLength, linksMultiLink, linksMultiLinkLength, megaMenu, submenu, link);
  });
  item.addEventListener('mouseleave', function () {
    linksMouseLeaveAction(linksMultiLink, linksMultiLinkLength, linksMultiMenu, linksMultiMenuLength);
  });
  link.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
      if (link.getAttribute('aria-expanded') === 'false') {
        linksMouseEnterAction(item, iconBtnContent, iconBtnContentLength, iconBtn, iconBtnLength, linksMultiLink, linksMultiLinkLength, megaMenu, submenu, link);
      } else if (link.getAttribute('aria-expanded') === 'true') {
        linksMouseLeaveAction(linksMultiLink, linksMultiLinkLength, linksMultiMenu, linksMultiMenuLength);
      }
    }
  });
  link.addEventListener('touchend', function (e) {
    if (link.getAttribute('aria-expanded') === 'false') {
      linksMouseEnterAction(item, iconBtnContent, iconBtnContentLength, iconBtn, iconBtnLength, linksMultiLink, linksMultiLinkLength, megaMenu, submenu, link);
    } else if (link.getAttribute('aria-expanded') === 'true') {
      linksMouseLeaveAction(linksMultiLink, linksMultiLinkLength, linksMultiMenu, linksMultiMenuLength);
    }
  });
  link.addEventListener('focus', function () {
    if (window.innerWidth >= 992) {
      linksMouseLeaveAction(linksMultiLink, linksMultiLinkLength, linksMultiMenu, linksMultiMenuLength);
    }
  });
}

function linksMouseEnterAction(item, iconBtnContent, iconBtnContentLength, iconBtn, iconBtnLength, linksMultiLink, linksMultiLinkLength, megaMenu, submenu, link) {
  if (window.innerWidth >= 992) {
    //Reset direction of arrows to default
    navMenuIcoReset180(linksMultiLink, linksMultiLinkLength); //Rotate arrow of first level link

    link.setAttribute('aria-expanded', 'true');
    navSubmenuLinkTabEnable(item); //Show sub-menu

    submenu.setAttribute('aria-hidden', 'false'); //Show mega sub-menus

    navMegaSubmenuShow(item, megaMenu); //Hide content of other navigation item

    navSiblingContentHide(iconBtnContent, iconBtnContentLength, iconBtn, iconBtnLength);
  }
}

function linksMouseLeaveAction(linksMultiLink, linksMultiLinkLength, linksMultiMenu, linksMultiMenuLength) {
  if (window.innerWidth >= 992) {
    //Hide sub-menu
    navSubmenuHide(linksMultiMenu, linksMultiMenuLength); //Reset direction of arrows to default

    navMenuIcoReset180(linksMultiLink, linksMultiLinkLength);
  }
} //Sub-level - Click to expand or collapse


function linksClick(link, submenu) {
  if (link.className.indexOf('title-spotlight') === -1) {
    link.addEventListener('mouseup', function () {
      linksClickAction(this, submenu);
    });
    link.addEventListener('keyup', function (e) {
      if (e.key === 'Enter') {
        linksClickAction(this, submenu);
      }
    });
  }
}

function linksClickAction(link, submenu) {
  switch (true) {
    case window.innerWidth >= 992:
      if (link.parentNode.className.indexOf('first') === -1 && link.className.indexOf('mega-title') === -1) {
        linksClickApply(link, submenu);
      }

      break;

    default:
      linksClickApply(link, submenu);
  }
}

function linksClickApply(link, menu) {
  var submenu;
  var submenuLength;
  var submenuLinks;
  var submenuLinksLength;

  switch (menu.getAttribute('aria-hidden')) {
    case 'true':
      menu.style.maxHeight = menu.getAttribute('data-height') + 'px';
      menu.setAttribute('aria-hidden', 'false');
      link.setAttribute('aria-expanded', 'true');
      navSubmenuLinkTabEnable(link.parentNode);
      break;

    case 'false':
      submenu = link.parentNode.querySelectorAll('.sub-menu');
      submenuLength = submenu.length;
      submenuLinks = link.parentNode.querySelectorAll('a');
      submenuLinksLength = submenuLinks.length;
      menu.removeAttribute('style');
      menu.setAttribute('aria-hidden', 'true');
      link.setAttribute('aria-expanded', 'false');

      for (var b = 0; b < submenuLength; b++) {
        submenu[b].setAttribute('aria-hidden', 'true');
        submenu[b].removeAttribute('style');
      }

      for (var c = 0; c < submenuLinksLength; c++) {
        if (submenuLinks[c].getAttribute('aria-expanded') === 'true') {
          submenuLinks[c].setAttribute('aria-expanded', 'false');
        }

        setTabIndex(submenuLinks[c], '-1');
      }

      break;
  }
}
/*	================================================================================
		Navigation: Reusable functions
=================================================================================	*/
//Hide sub-menus


function navSubmenuHide(linksMultiMenu, linksMultiMenuLength) {
  var hyperlink, hyperlinkLength;

  for (var i = 0; i < linksMultiMenuLength; i++) {
    linksMultiMenu[i].setAttribute('aria-hidden', 'true');
    linksMultiMenu[i].removeAttribute('style');
    linksMultiMenu[i].previousElementSibling.setAttribute('aria-expanded', 'false');
    hyperlink = linksMultiMenu[i].querySelectorAll('A');
    hyperlinkLength = hyperlink.length;

    for (var a = 0; a < hyperlinkLength; a++) {
      setTabIndex(hyperlink[a], '-1');
    }
  }
} //Show sub-menus links


function navSubmenuLinkTabEnable(link) {
  var directLinks = link.querySelector('.sub-menu').childNodes;
  var directLinksLength = directLinks.length;

  for (var a = 0; a < directLinksLength; a++) {
    if (directLinks[a].tagName === 'A' && !directLinks[a].getAttribute('aria-expanded')) {
      removeTabIndex(directLinks[a]);
    } else if (directLinks[a].className) {
      if (directLinks[a].className.indexOf('multi-level') !== -1) {
        removeTabIndex(directLinks[a].querySelector('A'));
      }
    }
  }
} // Show mega sub-menus


function navMegaSubmenuShow(item, megaMenu) {
  if (megaMenu && item.className.indexOf('mega') !== -1) {
    var submenuFirst = item.childNodes;
    var submenuFirstLength = submenuFirst.length;
    var submenuFirstClass;
    var submenu;
    var submenuLength;
    var submenuParent;
    var submenuParentClass;

    for (var a = 0; a < submenuFirstLength; a++) {
      submenuFirstClass = submenuFirst[a].className;

      if (submenuFirstClass !== undefined && submenuFirstClass.indexOf('sub-menu') !== -1) {
        submenu = submenuFirst[a].querySelectorAll('.sub-menu');
        submenuLength = submenu.length;

        for (var b = 0; b < submenuLength; b++) {
          submenuParent = submenu[b].parentNode.parentNode.parentNode;
          submenuParentClass = submenuParent.className;

          if (submenuParentClass !== undefined && submenuParentClass.indexOf('mega') !== -1) {
            submenu[b].setAttribute('aria-hidden', 'false');
          }
        }
      }
    }
  }
} //Reset direction of arrows to default


function navMenuIcoReset180(link, linkLength) {
  for (var i = 0; i < linkLength; i++) {
    link[i].setAttribute('aria-expanded', 'false');
  }
} //Hide content of other navigation item


function navSiblingContentHide(content, contentLength, button, buttonLength) {
  for (var i = 0; i < contentLength; i++) {
    content[i].setAttribute('aria-hidden', 'true');
    content[i].removeAttribute('style'); //Disable tab on own's content

    targetFocusHide(targetFocusElems(content[i]));
  }

  for (var _i2 = 0; _i2 < buttonLength; _i2++) {
    button[_i2].setAttribute('aria-expanded', 'false');
  }
} //Hide side-menu's show button (to prevent overlapping)


function sideMenuShowBtnHide(menu, showButton) {
  if (menu) {
    if (menu.getAttribute('aria-hidden') === 'true') {
      showButton.setAttribute('aria-hidden', 'true');
      setTabIndex(showButton, '-1');
    }
  }
} //Show side-menu's show button


function sideMenuShowBtnShow(menu, showButton) {
  if (menu) {
    if (menu.getAttribute('aria-hidden') === 'true') {
      showButton.setAttribute('aria-hidden', 'false');
      removeTabIndex(showButton);
    }
  }
}
/*	================================================================================
		Input: Show 'X' when filled / Click on 'X' to clear input
=================================================================================	*/


function inputClear(item) {
  if (item && navigator.userAgent.indexOf('Trident') === -1) {
    var clearBtn = item.querySelector('.clear-search');
    var input = item.querySelector('input');
    setTabIndex(clearBtn, '-1');
    input.addEventListener('keyup', function () {
      //Show or hide 'X' button
      switch (this.value.length) {
        case 0:
          clearBtn.setAttribute('aria-hidden', 'true');
          setTabIndex(clearBtn, '-1');
          break;

        default:
          clearBtn.setAttribute('aria-hidden', 'false');
          removeTabIndex(clearBtn);
      } //Click on 'X' to clear input


      clearBtn.addEventListener('mouseup', function () {
        inputClearAction(this, input);
      });
    });
    clearBtn.addEventListener('keyup', function (e) {
      if (e.key === 'Enter') {
        inputClearAction(this, input);
      }
    });
  }
}

function inputClearAction(button, input) {
  input.value = '';
  input.focus();
  button.setAttribute('aria-hidden', 'true');
  setTabIndex(button, '-1');
}
/*	================================================================================
		Side menu
=================================================================================	*/


function sideMenuInit(sideMenu) {
  var windowWidth = window.innerWidth;
  var footer = document.querySelector('body > footer');
  var contentArea = document.querySelector('.main-section');
  var showButton = sideMenu.querySelector('.show-menu-btn');
  var hideButton = sideMenu.querySelector('.hide-menu-btn');
  var subMenu = sideMenu.querySelectorAll('.sub-menu');
  var subMenuLength = subMenu.length;
  var toggleLink = sideMenu.querySelectorAll('[data-toggle-button]');
  var toggleLinkLength = toggleLink.length;
  var toggleLinkTarget, link, linkLength;
  sideMenu.setAttribute('data-first-resize', 'true'); // Click to expand sub menus

  for (var a = 0; a < toggleLinkLength; a++) {
    toggleLinkTarget = toggleLink[a].parentNode.querySelector('[data-toggle-content]');
    toggleBtnSingle(toggleLink[a], targetFocusElems(toggleLinkTarget), toggleItemProperties(toggleLinkTarget), 'accordion');
  } //click to show menu


  showButton.addEventListener('mouseup', function () {
    sideMenuShow(sideMenu, contentArea, this, footer);
  });
  showButton.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
      sideMenuShow(sideMenu, contentArea, this, footer);
      hideButton.focus();
    }
  }); //click to hide menu

  hideButton.addEventListener('mouseup', function () {
    sideMenuHide(sideMenu, contentArea, showButton, footer);
  });
  hideButton.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
      sideMenuHide(sideMenu, contentArea, showButton, footer);
      showButton.focus();
    }
  }); //close if click outside

  sideMenu.addEventListener('mouseup', function (e) {
    if (e.target === this) {
      document.body.removeAttribute('style');
      this.setAttribute('aria-hidden', 'true');
      this.querySelector('.show-menu-btn').setAttribute('aria-hidden', 'false');
    }
  }); //click to expand sub level link

  for (var b = 0; b < subMenuLength; b++) {
    link = subMenu[b].querySelectorAll('A');
    linkLength = link.length;

    for (var c = 0; c < linkLength; c++) {
      sideMenuSubClick(link[c]);
    }
  } //hide or size menu depending on window size


  if (windowWidth < 992) {
    sideMenuHide(sideMenu, contentArea, showButton, footer);
  } else {
    sideMenuShow(sideMenu, contentArea, showButton, footer);
  } //resize


  window.addEventListener('resize', function () {
    windowWidth = window.innerWidth;

    switch (true) {
      case windowWidth < 992:
        if (sideMenu.getAttribute('aria-hidden') === 'true' || sideMenu.getAttribute('data-first-resize') === 'true') {
          sideMenuHide(sideMenu, contentArea, showButton, footer);
        }

        if (sideMenu.getAttribute('data-first-resize') === 'true') {
          sideMenu.removeAttribute('data-first-resize', 'false');
        }

        break;

      case windowWidth >= 992:
        sideMenuShow(sideMenu, contentArea, showButton, footer);
        sideMenu.setAttribute('data-first-resize', 'true');
        break;
    }
  });
}

function sideMenuSubClick(item) {
  var siblings = item.parentNode.parentNode.querySelectorAll('A');
  var siblingsLength = siblings.length;
  item.addEventListener('mouseup', function () {
    for (var i = 0; i < siblingsLength; i++) {
      siblings[i].setAttribute('aria-selected', 'false');
    }

    this.setAttribute('aria-selected', 'true');
  });
} // Show side menu


function sideMenuShow(sideMenu, sideMenuContent, sideMenuShowBtn, footer) {
  sideMenuShowBtn.setAttribute('aria-hidden', 'true');
  setTabIndex(sideMenuShowBtn, '-1');
  sideMenu.setAttribute('aria-hidden', 'false');
  sideMenuContent.setAttribute('aria-hidden', 'false');
  hideShowFooter(footer, 'false');
} // Hide side menu


function sideMenuHide(sideMenu, sideMenuContent, sideMenuShowBtn, footer) {
  sideMenuShowBtn.setAttribute('aria-hidden', 'false');
  removeTabIndex(sideMenuShowBtn);
  sideMenu.setAttribute('aria-hidden', 'true');
  sideMenuContent.setAttribute('aria-hidden', 'true');
  hideShowFooter(footer, 'true');
} // Show or hide footer


function hideShowFooter(footer, value) {
  if (footer) {
    footer.setAttribute('data-menu-hidden', value);
  }
}
/*	================================================================================
		Side navigation
=================================================================================	*/


function sideNav(navigation) {
  var windowWidth;
  var menuButton = navigation.parentNode.querySelector('.mobile-menu');
  var toggleLink = navigation.querySelectorAll('[data-toggle-button]');
  var toggleLinkLength = toggleLink.length;
  var toggleLinkTarget;

  for (var i = 0; i < toggleLinkLength; i++) {
    toggleLinkTarget = toggleLink[i].parentNode.querySelector('[data-toggle-content]');
    toggleBtnSingle(toggleLink[i], targetFocusElems(toggleLinkTarget), toggleItemProperties(toggleLinkTarget), 'accordion');
  }

  if (menuButton) {
    sideNavClick(menuButton, navigation);
    sideNavResize(menuButton, navigation);
    window.addEventListener('resize', function () {
      sideNavResize(menuButton, navigation, windowWidth);
    });
  }
}

function sideNavResize(menuButton, navigation, windowWidth) {
  windowWidth = window.innerWidth;

  switch (true) {
    case windowWidth < 992:
      if (navigation.getAttribute('aria-hidden') === 'false') {
        navigation.setAttribute('aria-hidden', 'true');
        menuButton.setAttribute('aria-expanded', 'false');
      }

      break;

    case windowWidth >= 992:
      navigation.setAttribute('aria-hidden', 'false');
      menuButton.setAttribute('aria-expanded', 'false');
      break;
  }
}

function sideNavClick(menuButton, navigation) {
  menuButton.addEventListener('mouseup', function () {
    sideNavClickAction(this, navigation);
  });
  menuButton.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
      sideNavClickAction(this, navigation);
    }
  });
}

function sideNavClickAction(menuButton, navigation) {
  switch (navigation.getAttribute('aria-hidden')) {
    case 'false':
      navigation.setAttribute('aria-hidden', 'true');
      menuButton.setAttribute('aria-expanded', 'false');
      break;

    case 'true':
      navigation.setAttribute('aria-hidden', 'false');
      menuButton.setAttribute('aria-expanded', 'true');
      break;
  }
}
/*	================================================================================
		Table: Cards
=================================================================================	*/


function tableCards(table) {
  var tableBody = table.querySelectorAll('tbody td');
  var tableBodyLength = tableBody.length;
  var tableHeader = table.querySelectorAll('th');
  var tableTr = table.querySelectorAll('tr');
  var tableTrLength = tableTr.length;
  var tableTd;
  var tableTdLength;

  if (tableBodyLength !== 1) {
    for (var a = 0; a < tableTrLength; a++) {
      tableTd = tableTr[a].querySelectorAll('td');
      tableTdLength = tableTd.length;

      for (var b = 0; b < tableTdLength; b++) {
        tableTd[b].insertAdjacentHTML('afterbegin', '<span class="table-label">' + tableHeader[b].textContent + "</span>");
      }
    }
  }
}
/*	================================================================================
		Table responsive
=================================================================================	*/


function tableShadow(parent) {
  parent.insertAdjacentHTML('afterbegin', '<div class="table-shadow table-shadow-left"></div><div class="table-shadow table-shadow-right"></div>');
  var table = parent.querySelector('TABLE');
  var shadowLeft = parent.querySelector('.table-shadow-left');
  var shadowRight = parent.querySelector('.table-shadow-right');
  tableShadowResize(parent, table, shadowLeft, shadowRight);
  window.addEventListener('resize', function () {
    tableShadowResize(parent, table, shadowLeft, shadowRight);
  });
  parent.addEventListener('scroll', function () {
    tableShadowResize(parent, table, shadowLeft, shadowRight);
  });
}

function tableShadowResize(parent, table, shadowLeft, shadowRight) {
  var parentWidth = parent.offsetWidth;
  var tableWidth = table.offsetWidth;
  var distScrolled = parent.scrollLeft;
  ;

  if (tableWidth <= parentWidth) {
    removeClassName(parent, 'scrollable');
    tableShadowResizeRemoveLeft(shadowLeft);
    tableShadowResizeRemoveRight(shadowRight, tableWidth, parentWidth);
  } else {
    addClassName(parent, 'scrollable');

    if (distScrolled < tableWidth - parentWidth) {
      tableShadowResizeAddRight(shadowRight, distScrolled);

      if (distScrolled <= 0) {
        tableShadowResizeRemoveLeft(shadowLeft);
      } else {
        tableShadowResizeAddLeft(shadowLeft, distScrolled);
      }
    } else {
      tableShadowResizeAddLeft(shadowLeft, distScrolled);
      tableShadowResizeRemoveRight(shadowRight, tableWidth, parentWidth);
    }
  }
}

function tableShadowResizeAddRight(shadowRight, distScrolled) {
  addClassName(shadowRight, 'show');
  shadowRight.setAttribute('style', 'transform: translateX(' + distScrolled + 'px);');
}

function tableShadowResizeRemoveRight(shadowRight, tableWidth, parentWidth) {
  removeClassName(shadowRight, 'show');
  shadowRight.setAttribute('style', 'transform: translateX(' + (tableWidth - parentWidth) + 'px);');
}

function tableShadowResizeAddLeft(shadowLeft, distScrolled) {
  addClassName(shadowLeft, 'show');
  shadowLeft.setAttribute('style', 'transform: translateX(' + distScrolled + 'px);');
}

function tableShadowResizeRemoveLeft(shadowLeft) {
  removeClassName(shadowLeft, 'show');
  shadowLeft.setAttribute('style', 'transform: translateX(0px);');
}
/*	================================================================================
		Table: For table with no records - Find the total no. of columns
=================================================================================	*/


function tableNoResult(table) {
  var tableBody = table.querySelectorAll('tbody td');
  var tableBodyLength = tableBody.length;
  var tableHeaderLength = table.querySelectorAll('th').length;

  if (tableBodyLength === 1 && tableBodyLength !== tableHeaderLength) {
    tableBody[0].setAttribute('colspan', tableHeaderLength);
  }
}
/*	================================================================================
		Tabs
=================================================================================	*/


function tabArrows(tabParent) {
  var browserType = navigator.userAgent;
  var windowWidth = window.innerWidth;
  var tabHolder = tabParent.querySelector('.tabs-wrapper');
  var tabHolderWidth;
  var tab = tabHolder.querySelectorAll('.tab-item');
  var tabLength = tab.length;
  var totalWidth = 0;
  var scrollArea = 0;
  var distScrolled = 200;
  var currDistScrolled = 0;
  var arrowBack;
  var arrowNext; //Insert arrows

  tabHolder.insertAdjacentHTML('beforebegin', '<div class="arrow-wrapper"><i class="arrow next" aria-label="Scroll right" aria-hidden="false"><i class="material-icons" aria-hidden="true">chevron_right</i></i><i class="arrow back" aria-label="Scroll left" aria-hidden="false"><i class="material-icons" aria-hidden="true">chevron_left</i></i></div>');
  arrowBack = tabParent.querySelector('.arrow.back');
  arrowNext = tabParent.querySelector('.arrow.next'); //Call arrow functions

  arrBack(arrowBack, arrowNext, tab, tabLength, totalWidth, tabHolder, distScrolled, currDistScrolled, scrollArea, browserType);
  arrNext(arrowNext, arrowBack, tab, tabLength, totalWidth, tabHolder, distScrolled, currDistScrolled, scrollArea, browserType);
  arrScroll(tabHolder, tab, tabLength, totalWidth, arrowBack, arrowNext, browserType); //Show or hide arrows according to container's width

  tabArrowsResize(tab, tabLength, totalWidth, tabHolder, tabHolderWidth, arrowBack, arrowNext, browserType);
  window.addEventListener('resize', function () {
    if (window.innerWidth !== windowWidth) {
      tabArrowsResize(tab, tabLength, totalWidth, tabHolder, tabHolderWidth, arrowBack, arrowNext, browserType);
    }
  });
} //Update value when window resizes


function tabArrowsResize(tab, tabLength, totalWidth, tabHolder, tabHolderWidth, arrowBack, arrowNext, browserType) {
  tabHolderWidth = tabHolder.offsetWidth;

  for (var i = 0; i < tabLength; i++) {
    totalWidth += tab[i].offsetWidth;
  }

  switch (true) {
    case tabHolderWidth >= totalWidth:
      arrowBack.setAttribute('aria-hidden', 'true');
      arrowNext.setAttribute('aria-hidden', 'true');
      break;

    default:
      showHideArrScroll(arrowBack, arrowNext, tabHolder.scrollLeft, totalWidth - tabHolderWidth, browserType);
  }

  totalWidth = 0;
} //Click next


function arrNext(arrowNext, arrowBack, tab, tabLength, totalWidth, tabHolder, distScrolled, currDistScrolled, scrollArea, browserType) {
  arrowNext.addEventListener('mouseup', function () {
    currDistScrolled = tabHolder.scrollLeft;
    scrollArea = getscrollArea(tab, tabLength, totalWidth, tabHolder);

    switch (true) {
      default:
        currDistScrolled += distScrolled;
        break;

      case currDistScrolled >= scrollArea:
        currDistScrolled = scrollArea;
        break;
    }

    arrScrollAnim(tabHolder, currDistScrolled, scrollArea, browserType);
    showHideArrScroll(arrowBack, this, currDistScrolled, scrollArea, browserType);
  });
} //Click back


function arrBack(arrowBack, arrowNext, tab, tabLength, totalWidth, tabHolder, distScrolled, currDistScrolled, scrollArea, browserType) {
  arrowBack.addEventListener('mouseup', function () {
    currDistScrolled = tabHolder.scrollLeft;
    scrollArea = getscrollArea(tab, tabLength, totalWidth, tabHolder);

    switch (true) {
      default:
        currDistScrolled -= distScrolled;
        break;

      case currDistScrolled <= 0:
        currDistScrolled = 0;
        break;
    }

    arrScrollAnim(tabHolder, currDistScrolled, scrollArea, browserType);
    showHideArrScroll(this, arrowNext, currDistScrolled, scrollArea, browserType);
  });
} //Hide arrow when scrolled to start or end of the container


function arrScroll(item, tab, tabLength, totalWidth, arrowBack, arrowNext, browserType) {
  item.addEventListener('scroll', function () {
    for (var i = 0; i < tabLength; i++) {
      totalWidth += tab[i].offsetWidth;
    }

    showHideArrScroll(arrowBack, arrowNext, this.scrollLeft, totalWidth - this.offsetWidth, browserType);
    totalWidth = 0;
  });
}

function getscrollArea(tab, tabLength, totalWidth, tabHolder) {
  for (var i = 0; i < tabLength; i++) {
    totalWidth += tab[i].offsetWidth;
  }

  return totalWidth - tabHolder.offsetWidth;
}

function showHideArrScroll(arrowBack, arrowNext, currDistScrolled, scrollArea, browserType) {
  if (browserType.indexOf('Safari') !== -1 && browserType.indexOf('Chrome') === -1) {
    scrollArea -= 32;
  }

  switch (true) {
    case currDistScrolled >= scrollArea:
      arrowBack.setAttribute('aria-hidden', 'false');
      arrowNext.setAttribute('aria-hidden', 'true');
      break;

    case currDistScrolled <= 0:
      arrowBack.setAttribute('aria-hidden', 'true');
      arrowNext.setAttribute('aria-hidden', 'false');
      break;

    default:
      arrowBack.setAttribute('aria-hidden', 'false');
      arrowNext.setAttribute('aria-hidden', 'false');
  }
}

function arrScrollAnim(tabHolder, currDistScrolled, scrollArea, browserType) {
  switch (true) {
    case browserType.indexOf('Safari') !== -1 && browserType.indexOf('Chrome') === -1:
    case browserType.indexOf('Trident') !== -1:
    case browserType.indexOf('Edge') !== -1:
      smoothScroll(tabHolder, currDistScrolled, scrollArea, 200);
      break;

    default:
      tabHolder.scrollLeft = currDistScrolled;
  }
}

function smoothScroll(container, endLocation, scrollArea, duration) {
  var startLocation = container.scrollLeft;
  var currLocation;
  var distance = endLocation - startLocation;
  var increments = distance / (duration / 16);
  var runAnimation = setInterval(animateScroll, 16);
  var currIncrement = 0;

  if (distance < 0) {
    distance = -distance;
  }

  if (increments < 0) {
    increments = -increments;
  }

  function animateScroll() {
    switch (true) {
      case endLocation < startLocation:
        container.scrollLeft = startLocation - currIncrement;
        break;

      case endLocation >= startLocation:
        container.scrollLeft = startLocation + currIncrement;
        break;
    }

    currIncrement += increments;
    currLocation = container.scrollLeft;

    switch (true) {
      case endLocation < startLocation:
        if (currLocation <= endLocation || currLocation <= 0 || currIncrement >= scrollArea) {
          clearInterval(runAnimation);
        }

        break;

      case endLocation >= startLocation:
        if (currLocation > endLocation || currIncrement >= scrollArea) {
          clearInterval(runAnimation);
        }

        break;
    }
  }
}
/*  ================================================================================
		Toggle: Click to go to next or prev page
================================================================================= */


function toggleBtnPrevNext(item) {
  var body = document.body;
  var docRoot = document.documentElement;
  var groupName = item.getAttribute('data-group');
  var btnPrev = item.querySelector('.tab-prev');
  var btnNext = item.querySelector('.tab-next');
  var allBtns = document.querySelectorAll('[data-toggle-button-grp]');
  var allBtnsLength = allBtns.length;
  var pages;
  var pagesLength;

  for (var i = 0; i < allBtnsLength; i++) {
    if (allBtns[i].getAttribute('data-group') === groupName) {
      pages = allBtns[i].querySelectorAll('[data-toggle-button]');
      pagesLength = pages.length - 1;
    }
  }

  toggleBtnPrevClick(btnPrev, btnNext, pages, pagesLength, body, docRoot);
  toggleBtnNextClick(btnPrev, btnNext, pages, pagesLength, body, docRoot);
}
/*  ================================================================================
		Toggle: Click to go to next page
================================================================================= */


function toggleBtnNextClick(btnPrev, btnNext, pages, pagesLength, body, docRoot) {
  var windowHeight;
  var pageSelected;
  var pageNext;
  var pageNextTop;
  var labelPrev;
  var labelNext;
  var currPageNo;
  btnNext.addEventListener('mouseup', function () {
    windowHeight = window.innerHeight;
    currPageNo = 0;

    for (var i = pagesLength; i >= 0; i--) {
      // Select the active button
      if (pages[i].getAttribute('aria-selected') === 'true') {
        currPageNo = parseInt(pages[i].getAttribute('data-page'), 10);

        if (currPageNo <= pagesLength - 1) {
          currPageNo += 1; //Set currently selected button to inactive

          pages[i].setAttribute('aria-selected', 'false'); //Set newly selected button to active

          pageSelected = pages[i].parentNode.querySelector('[data-page="' + currPageNo + '"]');
          pageSelected.setAttribute('aria-selected', 'true');
          pageSelected.parentNode.scrollLeft = pageSelected.offsetLeft - 88; //Hides current page

          document.querySelector(pages[i].getAttribute('data-target')).setAttribute('aria-hidden', 'true'); //Shows the next page

          pageNext = document.querySelector(pageSelected.getAttribute('data-target'));
          pageNext.setAttribute('aria-hidden', 'false'); //Get next page's distance from the top of the page

          pageNextTop = pageNext.offsetTop; //Scroll to top

          switch (pageNext.getAttribute('data-subtype')) {
            case 'fullpage':
              //Scroll to top of the page
              body.scrollTop = 0;
              docRoot.scrollTop = 0;
              break;

            case 'page':
              if (pageNext.offsetHeight >= windowHeight) {
                body.scrollTop = pageNextTop;
                docRoot.scrollTop = pageNextTop;
              }

              break;
          } //Update label of next and prev buttons


          labelPrev = pages[i].parentNode.querySelector('[data-page="' + (currPageNo - 1) + '"]').innerHTML.replace(/<br>/g, ' ');
          labelNext = toggleBtnLabel(pages[i].parentNode.querySelector('[data-page="' + (currPageNo + 1) + '"]'));
        }
      }
    } //Toggle opacity of next and prev buttons


    toggleOpacityPrevNext(btnPrev, this, currPageNo, pagesLength); //Update label of prev and next button

    toggleBtnLabelUpdate(labelPrev, btnPrev, labelNext, btnNext);
  });
}
/*  ================================================================================
		Toggle: Click to go to prev page
================================================================================= */


function toggleBtnPrevClick(btnPrev, btnNext, pages, pagesLength, body, docRoot) {
  var windowHeight;
  var pageselected;
  var pagePrev;
  var pagePrevTop;
  var labelNext;
  var labelPrev;
  var currPageNo;
  btnPrev.addEventListener('mouseup', function () {
    windowHeight = window.innerHeight;
    currPageNo = 0;

    for (var i = 0; i < pagesLength + 1; i++) {
      // Select the active button
      if (pages[i].getAttribute('aria-selected') === 'true') {
        currPageNo = parseInt(pages[i].getAttribute('data-page'), 10);

        if (currPageNo >= 1) {
          currPageNo -= 1; //Set currently selected button to inactive

          pages[i].setAttribute('aria-selected', 'false'); //Set newly selected button to active

          pageselected = pages[i].parentNode.querySelector('[data-page="' + currPageNo + '"]');
          pageselected.setAttribute('aria-selected', 'true');
          pageselected.parentNode.scrollLeft = pageselected.offsetLeft - 88; //Hides current page

          document.querySelector(pages[i].getAttribute('data-target')).setAttribute('aria-hidden', 'true'); //Shows the previous page

          pagePrev = document.querySelector(pageselected.getAttribute('data-target'));
          pagePrev.setAttribute('aria-hidden', 'false'); //Get previous page's distance from the top of the page

          pagePrevTop = pagePrev.offsetTop; //Scroll to top

          switch (pagePrev.getAttribute('data-subtype')) {
            case 'fullpage':
              body.scrollTop = 0;
              docRoot.scrollTop = 0;
              break;

            case 'page':
              if (pagePrev.offsetHeight >= windowHeight) {
                body.scrollTop = pagePrevTop;
                docRoot.scrollTop = pagePrevTop;
              }

              break;
          } //Update label of next and prev buttons


          labelNext = pages[i].parentNode.querySelector('[data-page="' + (currPageNo + 1) + '"]').innerHTML.replace(/<br>/g, ' ');
          labelPrev = toggleBtnLabel(pages[i].parentNode.querySelector('[data-page="' + (currPageNo - 1) + '"]'));
        }
      }
    } //Toggle opacity of next and prev buttons


    toggleOpacityPrevNext(this, btnNext, currPageNo, pagesLength); //Update label of prev and next button

    toggleBtnLabelUpdate(labelPrev, btnPrev, labelNext, btnNext);
  });
}
/*	================================================================================
		Toggle next and prev (reusable functions)
=================================================================================	*/
// Toggle opacity of prev button


function toggleOpacityPrev(buttonPrev, pageNo) {
  switch (true) {
    case pageNo < 1:
      buttonPrev.style.opacity = '0';
      break;

    default:
      buttonPrev.style.opacity = '1';
  }
} // Toggle opacity of next button


function toggleOpacityNext(buttonNext, pageNo, pageTotal) {
  switch (true) {
    case pageNo >= pageTotal:
      buttonNext.style.opacity = '0';
      break;

    default:
      buttonNext.style.opacity = '1';
  }
} // Toggle opacity of prev and next button


function toggleOpacityPrevNext(buttonPrev, buttonNext, pageNo, pageTotal) {
  switch (true) {
    case pageNo < 1:
      buttonPrev.style.opacity = '0';
      break;

    case pageNo >= pageTotal:
      buttonNext.style.opacity = '0';
      break;

    default:
      buttonPrev.style.opacity = '1';
      buttonNext.style.opacity = '1';
  }
} // Get text of label for next or prev button


function toggleBtnLabel(label) {
  switch (label) {
    case null:
      return '';

    default:
      return label.innerHTML.replace(/<br>/g, ' ');
  }
} // Update label of next and prev button


function toggleBtnLabelUpdate(labelPrev, btnPrev, labelNext, btnNext) {
  //Update label of prev button
  if (labelPrev) {
    btnPrev.innerHTML = labelPrev;
  } //Update label of next button


  if (labelNext) {
    btnNext.innerHTML = labelNext;
  }
}
/*	================================================================================
		Upload file
=================================================================================	*/


function uploadFile(item) {
  var windowWidth = window.innerWidth;
  var label = item.querySelector('.upload-label');
  var input = item.querySelector('.form-control');
  var holder = item.parentNode;
  uploadFilename(item, windowWidth, label, input, holder);
  uploadResize(label, input);
  window.addEventListener('resize', function () {
    uploadResize(label, input);
  });
}

function uploadFilename(item, windowWidth, label, input, holder) {
  var currentValue;
  var uploadedFile;
  input.addEventListener('change', function () {
    currentValue = this.value;

    if (currentValue.length !== 0) {
      switch (this.className) {
        case 'upload-drag':
          switch (true) {
            case windowWidth < 576:
              label.textContent = 'Select another file';
              break;

            case windowWidth >= 576:
              label.textContent = 'Drag and drop another file here';
              break;
          }

          break;

        default:
          label.textContent = 'Select another file';
      }

      holder.insertAdjacentHTML('beforeend', '<div class="upload-file"><div class="upload-delete-btn" role="button" aria-label="Delete file"></div><a href="#" class="filename">' + currentValue.substring(currentValue.lastIndexOf("\\") + 1) + '</a><div class="description"><label class="form-label text-smaller">File description</label><input type="text" class="form-control form-control-sm" placeholder="Enter file description"></div></div>');
      uploadedFile = holder.querySelectorAll('.upload-file');
      uploadDelete(uploadedFile[uploadedFile.length - 1], holder, label);
    }
  });
}

function uploadResize(label, input) {
  var windowWidth = window.innerWidth;
  var labelText = label.textContent;

  if (input.className.indexOf('upload-drag') !== -1) {
    switch (true) {
      case windowWidth < 576:
        replaceClassName(input, 'upload-drag', 'upload-drag-m');
        label.textContent = labelText.replace('Drag and drop', 'Choose').replace(' here', '');
        break;

      case windowWidth >= 576:
        replaceClassName(input, 'upload-drag-m', 'upload-drag');

        if (labelText.indexOf(' here') === -1) {
          label.textContent = labelText.replace('Choose', 'Drag and drop').concat(' here');
        }

        break;
    }
  }
}

function uploadDelete(item, holder, label) {
  var windowWidth;
  var typeDrag = holder.querySelector('.upload-drag');
  item.querySelector('.upload-delete-btn').addEventListener('mouseup', function () {
    windowWidth = window.innerWidth;

    switch (typeDrag) {
      case null:
        label.textContent = 'Choose a file';
        break;

      default:
        switch (true) {
          case windowWidth < 576:
            label.textContent = 'Choose a file';
            break;

          case windowWidth >= 576:
            label.textContent = 'Drag and drop a file here';
            break;
        }

    }

    holder.removeChild(item);
  });
}

function uploadDeleteInit(item) {
  var deleteBtn = item.querySelector('.upload-delete-btn');

  if (deleteBtn) {
    var windowWidth;
    var container = item.parentNode;
    var label = container.querySelector('INPUT');
    var isDraggable = container.querySelector('.upload-drag');
    deleteBtn.addEventListener('mouseup', function () {
      windowWidth = window.innerWidth;

      if (isDraggable) {
        if (windowWidth < 576) {
          label.textContent = 'Choose a file';
        } else {
          label.textContent = 'Drag and drop a file here';
        }
      } else {
        label.textContent = 'Choose a file';
      }

      container.removeChild(item);
    });
  }
}
/*	================================================================================
		Toggle: Content
=================================================================================	*/

/** Toggle: Content
 *  Call functions  */


function toggleContent(item) {
  var itemElems = targetFocusElems(item);
  var type = item.getAttribute('data-subtype');
  var isHidden = item.getAttribute('aria-hidden');
  var computedStyle = window.getComputedStyle(item);
  var marginBottom = getStyleValue('margin-bottom', computedStyle);
  var marginTop = getStyleValue('margin-top', computedStyle);
  var paddingBottom = getStyleValue('padding-bottom', computedStyle);
  var paddingTop = getStyleValue('padding-bottom', computedStyle); // check for disabled elements inside the target element

  targetFocusDisabledCheck(itemElems);

  if (isHidden === 'true') {
    item.setAttribute('aria-hidden', 'false');
  }

  item.setAttribute('data-mar-bot', marginBottom);
  item.setAttribute('data-mar-top', marginTop);
  item.setAttribute('data-pad-bot', paddingBottom);
  item.setAttribute('data-pad-top', paddingTop);
  item.setAttribute('data-height', item.offsetHeight + marginBottom + marginTop + paddingBottom + paddingTop);

  if (isHidden === 'true') {
    toggleHide(itemElems, type);
  } // resize


  window.addEventListener('resize', function () {
    isHidden = item.getAttribute('aria-hidden');

    if (isHidden === 'true') {
      item.setAttribute('aria-hidden', 'false');
    }

    if (toggleItemIsPage(type)) {
      item.setAttribute('style', 'max-height: none');
    } else {
      item.setAttribute('style', 'margin-bottom: ' + marginBottom + 'px; margin-top: ' + marginTop + 'px; max-height: none; padding-bottom: ' + paddingBottom + 'px; padding-top: ' + paddingTop + 'px;');
    }

    item.setAttribute('data-height', item.offsetHeight + marginBottom + marginTop + paddingBottom + paddingTop);

    if (isHidden === 'true') {
      toggleHide(itemElems, type);
    }
  });
}
/*	================================================================================
		Toggle: Single item trigger
=================================================================================	*/


function toggleBtnSingleTrigger(button) {
  var target = document.querySelector(button.getAttribute('data-target'));
  toggleBtnSingle(button, targetFocusElems(target), toggleItemProperties(target), 'accordion');
}
/*	================================================================================
		Toggle: Single item (resuable)
=================================================================================	*/


function toggleBtnSingle(button, target, targetProps, type) {
  button.addEventListener('mouseup', function () {
    toggleBtnSingleAction(button, target, targetProps, type);
  });
  button.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
      toggleBtnSingleAction(button, target, targetProps, type);
    }
  });
}

function toggleBtnSingleAction(button, target, targetProps, type) {
  // Check if target is hidden
  var targetHidden = target.self.getAttribute('aria-hidden'); // Show or hide target

  toggleShowHide(button, targetHidden, target, targetProps, type);
}
/*	================================================================================
		Toggle: Grouped items
=================================================================================	*/

/** Toggle: Grouped items
 *  Call functions  */


function toggleBtnGroup(item) {
  var groupName = item.getAttribute('data-group');
  var toggleButtons = item.querySelectorAll('[data-toggle-button]');
  var toggleButtonsLength = toggleButtons.length;
  var target, targetType, targetElems;

  for (var i = 0; i < toggleButtonsLength; i++) {
    target = document.querySelector(toggleButtons[i].getAttribute('data-target'));
    targetType = target.getAttribute('data-subtype');
    targetElems = targetFocusElems(target);
    toggleButtons[i].setAttribute('data-page', i);
    toggleBtnGroupInit(toggleButtons[i], item, target, targetElems, targetType, toggleButtons, toggleButtonsLength, groupName);
  }
}
/** Toggle: Grouped items
 *  Call functions for prev and next buttons  */


function toggleBtnGroupInit(item, container, target, targetElems, targetType, group, groupLength, groupName) {
  var btnContainer = document.querySelectorAll('.tab-page');
  var btnContainerLength = btnContainer.length;
  var btnPrev, btnNext, pageCurrent, pagePrev, pageNext;

  for (var a = 0; a < groupLength; a++) {
    if (group[a].getAttribute('aria-selected') === 'true') {
      pageCurrent = parseInt(group[a].getAttribute('data-page'), 10);
      pagePrev = container.querySelector('[data-page="' + (pageCurrent - 1) + '"]');
      pageNext = container.querySelector('[data-page="' + (pageCurrent + 1) + '"]');
    }
  }

  for (var b = 0; b < btnContainerLength; b++) {
    if (btnContainer[b].getAttribute('data-group') === groupName) {
      btnPrev = btnContainer[b].querySelector('.tab-prev');
      btnNext = btnContainer[b].querySelector('.tab-next');
    }
  }

  if (btnContainerLength !== 0) {
    toggleBtnGroupPrevNext(btnPrev, btnNext, pagePrev, pageNext, pageCurrent, groupLength);
  }

  toggleBtnGroupClick(item, container, target, targetElems, targetType, group, groupLength, btnPrev, btnNext);
}
/** Toggle: Grouped items
 *  Click to show or hide content  */


function toggleBtnGroupClick(item, container, target, targetElems, targetType, group, groupLength, btnPrev, btnNext) {
  item.addEventListener('mouseup', function () {
    toggleBtnGroupClickAction(this, container, target, targetElems, targetType, group, groupLength, btnPrev, btnNext);
  });
  item.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
      toggleBtnGroupClickAction(this, container, target, targetElems, targetType, group, groupLength, btnPrev, btnNext);
    }
  });
  item.addEventListener('focus', function () {
    // Scroll offset
    container.scrollLeft = this.offsetLeft - 88;
  });
}

function toggleBtnGroupClickAction(item, container, target, targetElems, targetType, group, groupLength, btnPrev, btnNext) {
  var targetProps, groupTarget; // Variables for prev and next buttons

  var pageCurrent, pagePrev, pageNext; // Update copy of prev and next button

  pageCurrent = parseInt(item.getAttribute('data-page'), 10);
  pagePrev = container.querySelector('[data-page="' + (pageCurrent - 1) + '"]');
  pageNext = container.querySelector('[data-page="' + (pageCurrent + 1) + '"]');
  toggleBtnGroupPrevNext(btnPrev, btnNext, pagePrev, pageNext, pageCurrent, groupLength); // Scroll offset

  container.scrollLeft = item.offsetLeft - 88; // Get target's css properties

  if (!toggleItemIsPage(targetType)) {
    targetProps = toggleItemProperties(target);
  }

  for (var i = 0; i < groupLength; i++) {
    // Hide other targets in the same group
    group[i].setAttribute('aria-selected', 'false');
    groupTarget = document.querySelector(group[i].getAttribute('data-target'));
    toggleHide(targetFocusElems(groupTarget), targetType);
  } // Show target


  item.setAttribute('aria-selected', 'true');
  toggleShow(targetElems, targetProps, targetType); // Scroll to top if target's content type is 'full-page'

  if (targetType === 'fullpage') {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
}
/** Toggle: Grouped items:
 *  Show or hide prev and next button */


function toggleBtnGroupPrevNext(btnPrev, btnNext, pagePrev, pageNext, pageCurrent, totalPages) {
  toggleBtnGroupLabel(pagePrev, btnPrev);
  toggleOpacityPrev(btnPrev, pageCurrent);
  toggleBtnGroupLabel(pageNext, btnNext);
  toggleOpacityNext(btnNext, pageCurrent, totalPages - 1);
}
/** Toggle: Grouped items:
 *  Update copy of prev and next button */


function toggleBtnGroupLabel(pageTitle, buttonLabel) {
  if (pageTitle) {
    buttonLabel.innerHTML = pageTitle.innerHTML;
  } else {
    buttonLabel.innerHTML = '';
  }
}
/*	================================================================================
		Toggle (reusable function)
=================================================================================	*/
// Get CSS styles


function getStyleValue(property, computedStyle) {
  return parseInt(computedStyle.getPropertyValue(property).replace('px', ''), 10);
} // Show item


function toggleShow(target, targetProps, type) {
  target.self.setAttribute('aria-hidden', 'false');
  targetFocusShow(target);

  if (!toggleItemIsPage(type)) {
    target.self.setAttribute('style', 'margin-bottom: ' + targetProps.marginBottom + 'px; margin-top: ' + targetProps.marginTop + 'px; max-height: ' + targetProps.fullHeight() + 'px; padding-bottom: ' + targetProps.paddingBottom + 'px; padding-top: ' + targetProps.paddingTop + 'px;');
  }

  applyFunction('footer', stickyFooter);
} // Hide item


function toggleHide(target, type) {
  target.self.setAttribute('aria-hidden', 'true');
  targetFocusHide(target);

  if (!toggleItemIsPage(type)) {
    target.self.setAttribute('style', 'margin-bottom: 0; margin-top: 0; max-height: 0; padding-bottom: 0; padding-top: 0;');
  }

  applyFunction('footer', stickyFooter);
} // Show or hide content


function toggleShowHide(button, targetHidden, target, targetProps, type) {
  switch (targetHidden) {
    case 'false':
      // Hide content
      switch (type) {
        case 'accordion':
          button.setAttribute('aria-expanded', 'false');
          break;

        default:
          button.setAttribute('aria-selected', 'false');
      }

      toggleHide(target);
      break;

    case 'true':
      // Show content
      switch (type) {
        case 'accordion':
          button.setAttribute('aria-expanded', 'true');
          break;

        default:
          button.setAttribute('aria-selected', 'true');
      }

      toggleShow(target, targetProps);
      break;
  }
} // Get content css properties


function toggleItemProperties(item) {
  return {
    height: parseInt(item.getAttribute('data-height'), 10),
    marginBottom: parseInt(item.getAttribute('data-mar-bot'), 10),
    marginTop: parseInt(item.getAttribute('data-mar-top'), 10),
    paddingBottom: parseInt(item.getAttribute('data-pad-bot'), 10),
    paddingTop: parseInt(item.getAttribute('data-pad-top'), 10),
    fullHeight: function fullHeight() {
      return this.height + this.marginBottom + this.marginTop + this.paddingBottom + this.paddingTop;
    }
  };
} // Check content type


function toggleItemIsPage(type) {
  switch (type) {
    case 'page':
    case 'fullpage':
      return true;

    default:
      return false;
  }
}
/*	================================================================================
		Check if device is touch
=================================================================================	*/


function watchForHover() {
  var hasHoverClass = false;
  var lastTouchTime = 0;
  var body = document.body;

  function enableHover() {
    // filter emulated events coming from touch events
    if (new Date() - lastTouchTime < 500) return;
    if (hasHoverClass) return;
    addClassName(body, 'hasHover');
    hasHoverClass = true;
  }

  function disableHover() {
    if (!hasHoverClass) return;
    removeClassName(body, 'hasHover');
    hasHoverClass = false;
  }

  function updateLastTouchTime() {
    lastTouchTime = new Date();
  }

  document.addEventListener('touchstart', function () {
    updateLastTouchTime();
    disableHover();
  }, true);
  document.addEventListener('mousemove', enableHover, true);
  enableHover();
}
/*	================================================================================
		Link: Inserts prevent default script for empty links and links with '#'
=================================================================================	*/


function emptyLinkVoid(item) {
  switch (item.getAttribute('href')) {
    case '#':
    case '':
      item.addEventListener('click', function (e) {
        e.preventDefault();
      });
      break;
  }
}
/*	================================================================================
		Switch material icons outlined to regular on IE
=================================================================================	*/


function materialIconSwitch(item) {
  if (navigator.userAgent.indexOf('Trident') !== -1) {
    replaceClassName(item, 'material-icons-outlined', 'material-icons');
  }
}
/*	================================================================================
		Image auto-resize (reusable function)
=================================================================================	*/

/** Image auto-resize:
 *  Call functions */


function imgAutoResize(item, type) {
  var image = item.querySelector('IMG');
  imgAutoResizeApply(item, image, type);
  window.addEventListener('resize', function () {
    imgAutoResizeApply(item, image, type);
  });
}
/** Image auto-resize:
 *  Resize function */


function imgAutoResizeApply(item, image, type) {
  item.removeAttribute('style');
  image.removeAttribute('style');
  var imageWidth = image.offsetWidth;
  var imageHeight = image.offsetHeight;
  var imageRatio = imageWidth / imageHeight;
  var itemWidth = item.offsetWidth;
  var itemHeight = item.offsetHeight;
  var itemRatio = itemWidth / itemHeight;

  if (imageRatio > itemRatio) {
    // Ratio of image's width is larger than item's
    switch (type) {
      case 'cover':
        // To cover entire container
        image.style.height = '100%';
        image.style.width = 'auto';
        image.style.marginLeft = imgAutoResizeMargin(image.offsetWidth, item.offsetWidth) + 'px';
        break;

      default:
        image.setAttribute('style', 'height: auto; width: 100%');
      //item.setAttribute( 'style', 'width: ' + image.offsetHeight + 'px' );
    }
  } else {
    // Ratio of image's width is smaller than item's
    switch (type) {
      case 'cover':
        // To cover entire container
        image.style.height = 'auto';
        image.style.width = '100%';
        image.style.marginTop = imgAutoResizeMargin(image.offsetHeight, item.offsetHeight) + 'px';
        break;

      default:
        image.setAttribute('style', 'height: 100%; width: auto');
      //item.setAttribute( 'style', 'width: ' + image.offsetWidth + 'px' );
    }
  }
}
/** Image auto-resize - reusable:
 *  Calculate margins */


function imgAutoResizeMargin(imageSize, itemSize) {
  return -(imageSize - itemSize) / 2;
}
/*	================================================================================
		Get elements's height (reusable function)
=================================================================================	*/


function getItemHeight(item) {
  switch (item.getAttribute('aria-hidden')) {
    case 'true':
      item.setAttribute('aria-hidden', 'false');
      item.style.maxHeight = 'none';
      item.setAttribute('data-height', item.offsetHeight + 'px');
      item.removeAttribute('style');
      item.setAttribute('aria-hidden', 'true');
      break;

    default:
      item.style.maxHeight = 'none';
      item.setAttribute('data-height', item.offsetHeight + 'px');
      item.removeAttribute('style');
  }
}
/*	================================================================================
		Disable hidden target's element (reusable function)
=================================================================================	*/
// Select all focusable elements


function targetFocusElems(target) {
  return {
    self: target,
    link: target.querySelectorAll('A'),
    area: target.querySelectorAll('AREA'),
    button: target.querySelectorAll('BUTTON'),
    input: target.querySelectorAll('INPUT'),
    select: target.querySelectorAll('SELECT'),
    textarea: target.querySelectorAll('TEXTAREA'),
    iframe: target.querySelectorAll('IFRAME')
  };
} // Show target


function targetFocusShow(target) {
  targetFocusRemoveTab(target.link);
  targetFocusRemoveTab(target.area);
  targetFocusRemoveTab(target.iframe);
  targetFocusDisabledOff(target.button);
  targetFocusDisabledOff(target.input);
  targetFocusDisabledOff(target.select);
  targetFocusDisabledOff(target.textarea);
}

function targetFocusShowForced(target) {
  targetFocusRemoveTab(target.link);
  targetFocusRemoveTab(target.area);
  targetFocusRemoveTab(target.iframe);
  targetFocusDisabledOffForced(target.button);
  targetFocusDisabledOffForced(target.input);
  targetFocusDisabledOffForced(target.select);
  targetFocusDisabledOffForced(target.textarea);
} // Enable tab to element


function targetFocusRemoveTab(target) {
  for (var i = 0; i < target.length; i++) {
    removeTabIndex(target[i]);
  }
} // Enable forms


function targetFocusDisabledOff(target) {
  for (var i = 0; i < target.length; i++) {
    if (target[i].className) {
      if (target[i].className.indexOf('is-disabled') === -1) {
        target[i].removeAttribute('disabled');
      }
    }
  }
}

function targetFocusDisabledOffForced(target) {
  for (var i = 0; i < target.length; i++) {
    target[i].removeAttribute('disabled');
  }
} // Hide target


function targetFocusHide(target) {
  targetFocusHideTab(target.link);
  targetFocusHideTab(target.area);
  targetFocusHideTab(target.iframe);
  targetFocusDisabledOn(target.button);
  targetFocusDisabledOn(target.input);
  targetFocusDisabledOn(target.select);
  targetFocusDisabledOn(target.textarea);
  applyFunction('footer', stickyFooter);
} // Disable tab to element


function targetFocusHideTab(target) {
  for (var i = 0; i < target.length; i++) {
    setTabIndex(target[i], '-1');
  }
} // Disable forms


function targetFocusDisabledOn(target) {
  for (var i = 0; i < target.length; i++) {
    target[i].setAttribute('disabled', 'disabled');
  }
} // Check which input is disabled


function targetFocusDisabledCheck(target) {
  targetFocusDisabledCheckAppy(target.button);
  targetFocusDisabledCheckAppy(target.input);
  targetFocusDisabledCheckAppy(target.select);
  targetFocusDisabledCheckAppy(target.textarea);
}

function targetFocusDisabledCheckAppy(target) {
  for (var i = 0; i < target.length; i++) {
    if (target[i].getAttribute('disabled') !== null) {
      addClassName(target[i], 'is-disabled');
    }
  }
}
/*	================================================================================
		Set tabindex (reusable function)
=================================================================================	*/


function setTabIndex(item, value) {
  var itemLength = item.length;

  if (itemLength !== undefined) {
    for (var i = 0; i < itemLength; i++) {
      item[i].setAttribute('tabindex', value);
    }
  } else {
    item.setAttribute('tabindex', value);
  }
}

function removeTabIndex(item) {
  var itemLength = item.length;

  if (itemLength !== undefined) {
    for (var i = 0; i < itemLength; i++) {
      item[i].removeAttribute('tabindex');
    }
  } else {
    item.removeAttribute('tabindex');
  }
}
/*	================================================================================
		Check and apply css values - numerical (reusable function)
=================================================================================	*/


function applyCssValue(style) {
  if (style) {
    if (style !== 'auto') {
      return style + 'px';
    } else {
      return 'auto';
    }
  } else if (style !== 0) {
    return 'auto';
  } else {
    return style + 'px';
  }
}
/*	================================================================================
		Add, remove or replace class (reusable function)
=================================================================================	*/
// Add class name


function addClassName(item, newName) {
  var itemclassName = item.getAttribute('class');

  if (!itemclassName) {
    item.setAttribute('class', newName);
  } else if (itemclassName.indexOf(newName) === -1) {
    item.setAttribute('class', itemclassName + ' ' + newName);
  }
} // Remove class name


function removeClassName(item, itemName) {
  var itemclassName = item.getAttribute('class');

  if (itemclassName === itemName) {
    item.removeAttribute('class');
  } else if (itemclassName) {
    switch (itemclassName.indexOf(itemName)) {
      case 0:
        item.setAttribute('class', itemclassName.replace(itemName + ' ', ''));
        break;

      default:
        item.setAttribute('class', itemclassName.replace(' ' + itemName, ''));
    }
  }
} // Replace class name


function replaceClassName(item, itemName, newName) {
  var itemclassName = item.getAttribute('class');

  if (!itemclassName || itemclassName === itemName) {
    item.setAttribute('class', newName);
  } else if (itemclassName !== newName) {
    switch (itemclassName.indexOf(itemName)) {
      case -1:
        if (itemclassName.indexOf(newName) === -1) {
          itemclassName = itemclassName + ' ' + newName;
        }

        break;

      default:
        if (itemclassName.indexOf(newName) === -1 || itemName.indexOf(newName) !== -1) {
          itemclassName = itemclassName.replace(itemName, newName);
        }

    }

    item.setAttribute('class', itemclassName);
  }
}
/*	================================================================================
		Select item (reusable function)
=================================================================================	*/


function applyFunction(itemName, functionName, functionParameter) {
  var item = document.querySelectorAll(itemName);
  var itemLength = item.length;

  for (var i = 0; i < itemLength; i++) {
    functionName(item[i], functionParameter);
  }
}
