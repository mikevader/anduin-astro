---
title: "AirPrint server with Ansible and CUPS (it is simpler to buy a new printer)"
date: 2026-08-28
excerpt: "I wanted to make my printer available over AirPrint without buying a new one."
tags: [ansible, cups, homelab]
---

I wanted to make my printer available over AirPrint without buying a new one. CUPS and
Avahi do the work, and the whole thing is implemented with Ansible.

There is a role on Ansible Galaxy for exactly this,
[`nerab/airprint-server`](https://galaxy.ansible.com/nerab/airprint-server), and I used
[a guide from geekonthepc](https://www.geekonthepc.com/2016/07/10/guide-make-almost-any-printer-airprint-compatible-with-a-raspberry-pi-in-20-minutes/).
[One from elektronik-kompendium](https://www.elektronik-kompendium.de/sites/raspberry-pi/2007081.htm) I did
not use, but it might help somebody else. The role was not entirely satisfying, so I
made a copy with a few modifications. What was not satisfying about it I cannot tell
you any more.

The role installs the packages, puts the admin user into the `lpadmin` group and pushes
my own `cupsd.conf`:

```yaml
- name: Install prerequisite software
  apt:
    update_cache: yes
    name:
      - avahi-daemon
      - avahi-discover
      - cups
      - cups-pdf
#      - python-cups
    state: present
  become: true
  tags: apt,cups,airprint
```

`python-cups` is still commented out in that list. Could be that I tried it and took it out again.

The printers are copied in as files, from the playbook. The PPD for the Kyocera I
downloaded from [their website](https://kyoceradiscovery.com/download-center.html?category=technical&prod-category=%20All&product=1102MA2US0&page=2):

```yaml
- name: Setup AirPrint server
  hosts: airprint
  roles:
  - role: airprint_server
    vars:
      cups_admin_user: cups
  post_tasks:
  - name: Configure CUPS
    copy:
      src: "{{ item.src }}"
      dest: "{{ item.dest }}"
      owner: root
      group: root
      mode: 0644
      backup: yes
    with_items:
    - { src: 'cups/printers.conf', dest: '/etc/cups/printers.conf'}
    - { src: 'cups/ppd/Kyocera_Kyocera_FS-C2026MFP_.ppd', dest: '/etc/cups/ppd/Kyocera_Kyocera_FS-C2026MFP_.ppd' }
    - { src: 'cups/ppd/PDF.ppd', dest: '/etc/cups/ppd/PDF.ppd' }
    notify:
    - Restart CUPS
    become: true
    tags: cups,airprint
```

CUPS itself is then on `https://airprintserver:631`, which is not reachable from
outside.

One thing is still in the code. The role
notifies `restart CUPS` in lower case, and the handler is called `Restart CUPS`:

```yaml
# roles/airprint_server/tasks/main.yaml
  notify:
    - restart CUPS

# roles/airprint_server/handlers/main.yaml
- name: Restart CUPS
```

In the playbook above the notify is written with the capital R. Whether the one
in the role ever fired I do not know.

I never rolled it out. The role is there, the playbook is there, and then the project
got deprioritized. Simpler to buy a new printer.
