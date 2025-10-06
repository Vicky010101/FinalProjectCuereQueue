import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAppData } from './AppDataStore';
import { BillingReportsService } from './BillingReportsService';
import { toast } from 'sonner@2.0.3';
import {
  MessageCircle,
  Mic,
  MicOff,
  Send,
  Bot,
  User,
  Calendar,
  MapPin,
  CreditCard,
  FileText,
  Stethoscope,
  Clock,
  Phone,
  Languages,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  Activity,
  Heart,
  Brain,
  Eye
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  language: string;
}

interface ChatBotProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

// Multilingual responses
const responses = {
  en: {
    greeting: "Hello! I'm your Smart Hospital Assistant. I can help you with appointments, navigation, billing, and more. How can I assist you today?",
    goodbye: "Thank you for using our Smart Hospital Assistant. Have a great day and stay healthy!",
    notUnderstood: "I'm sorry, I didn't quite understand that. I can help you with:\n• Booking appointments\n• Finding doctors\n• Hospital navigation\n• Billing inquiries\n• Report status\n• Real-time wait times\n\nPlease try rephrasing your question or use the quick action buttons below.",
    voiceEnabled: "Voice recognition is now enabled. Please speak your question.",
    voiceDisabled: "Voice recognition is now disabled.",
    voiceError: "Sorry, I couldn't hear you clearly. Please try again or type your question.",
    departmentDirections: "Here are the directions to {department}:\n• Take the main elevator to {floor}\n• Turn {direction} after exiting\n• Look for signs pointing to {department}\n\nEstimated walk time: {time} minutes",
    appointmentBooked: "Great! I can help you book an appointment. You can also use the 'Book Appointment' feature in the main menu for detailed booking.",
    billingInfo: "I can help you check your billing status, outstanding payments, and payment options. Would you like me to show your current billing summary?",
    reportStatus: "I can check the status of your lab reports, imaging results, and test outcomes. Would you like me to show your current report status?"
  },
  es: {
    greeting: "¡Hola! Soy su Asistente Inteligente del Hospital. Puedo ayudarle con citas, navegación, facturación y más. ¿Cómo puedo ayudarle hoy?",
    goodbye: "Gracias por usar nuestro Asistente Inteligente del Hospital. ¡Que tenga un gran día y manténgase saludable!",
    notUnderstood: "Lo siento, no entendí bien eso. Puedo ayudarle con:\n• Reservar citas\n• Encontrar doctores\n• Navegación del hospital\n• Consultas de facturación\n• Estado de informes\n• Tiempos de espera en tiempo real\n\nPor favor, trate de reformular su pregunta o use los botones de acción rápida abajo.",
    voiceEnabled: "El reconocimiento de voz está ahora habilitado. Por favor, diga su pregunta.",
    voiceDisabled: "El reconocimiento de voz está ahora deshabilitado.",
    voiceError: "Lo siento, no pude escucharle claramente. Por favor, inténtelo de nuevo o escriba su pregunta.",
    departmentDirections: "Aquí están las direcciones a {department}:\n• Tome el ascensor principal al {floor}\n• Gire a la {direction} después de salir\n• Busque señales que apunten a {department}\n\nTiempo estimado de caminata: {time} minutos",
    appointmentBooked: "¡Excelente! Puedo ayudarle a reservar una cita. También puede usar la función 'Reservar Cita' en el menú principal para una reserva detallada.",
    billingInfo: "Puedo ayudarle a verificar su estado de facturación, pagos pendientes y opciones de pago. ¿Le gustaría que le muestre su resumen de facturación actual?",
    reportStatus: "Puedo verificar el estado de sus informes de laboratorio, resultados de imágenes y resultados de pruebas. ¿Le gustaría que le muestre el estado actual de sus informes?"
  },
  fr: {
    greeting: "Bonjour! Je suis votre Assistant Intelligent de l'Hôpital. Je peux vous aider avec les rendez-vous, la navigation, la facturation et plus. Comment puis-je vous aider aujourd'hui?",
    goodbye: "Merci d'utiliser notre Assistant Intelligent de l'Hôpital. Passez une excellente journée et restez en bonne santé!",
    notUnderstood: "Je suis désolé, je n'ai pas bien compris cela. Je peux vous aider avec:\n• Prendre des rendez-vous\n• Trouver des médecins\n• Navigation dans l'hôpital\n• Demandes de facturation\n• Statut des rapports\n• Temps d'attente en temps réel\n\nVeuillez essayer de reformuler votre question ou utilisez les boutons d'action rapide ci-dessous.",
    voiceEnabled: "La reconnaissance vocale est maintenant activée. Veuillez dire votre question.",
    voiceDisabled: "La reconnaissance vocale est maintenant désactivée.",
    voiceError: "Désolé, je n'ai pas pu vous entendre clairement. Veuillez réessayer ou taper votre question.",
    departmentDirections: "Voici les directions vers {department}:\n• Prenez l'ascenseur principal au {floor}\n• Tournez à {direction} après être sorti\n• Cherchez les panneaux pointant vers {department}\n\nTemps de marche estimé: {time} minutes",
    appointmentBooked: "Excellent! Je peux vous aider à prendre un rendez-vous. Vous pouvez aussi utiliser la fonction 'Prendre Rendez-vous' dans le menu principal pour une réservation détaillée.",
    billingInfo: "Je peux vous aider à vérifier votre statut de facturation, les paiements en attente et les options de paiement. Aimeriez-vous que je vous montre votre résumé de facturation actuel?",
    reportStatus: "Je peux vérifier le statut de vos rapports de laboratoire, résultats d'imagerie et résultats de tests. Aimeriez-vous que je vous montre le statut actuel de vos rapports?"
  }
};

// Hospital departments with locations
const hospitalDepartments = {
  en: {
    "emergency": { floor: "Ground Floor", direction: "right", time: 2 },
    "cardiology": { floor: "2nd Floor", direction: "left", time: 5 },
    "neurology": { floor: "3rd Floor", direction: "right", time: 7 },
    "radiology": { floor: "Basement", direction: "straight", time: 3 },
    "laboratory": { floor: "Ground Floor", direction: "left", time: 3 },
    "pharmacy": { floor: "Ground Floor", direction: "straight", time: 2 },
    "billing": { floor: "Ground Floor", direction: "left", time: 2 },
    "registration": { floor: "Ground Floor", direction: "right", time: 1 },
    "cafeteria": { floor: "2nd Floor", direction: "straight", time: 4 },
    "parking": { floor: "Outside", direction: "exit and turn left", time: 3 }
  },
  es: {
    "emergencia": { floor: "Planta Baja", direction: "derecha", time: 2 },
    "cardiología": { floor: "2do Piso", direction: "izquierda", time: 5 },
    "neurología": { floor: "3er Piso", direction: "derecha", time: 7 },
    "radiología": { floor: "Sótano", direction: "derecho", time: 3 },
    "laboratorio": { floor: "Planta Baja", direction: "izquierda", time: 3 },
    "farmacia": { floor: "Planta Baja", direction: "derecho", time: 2 },
    "facturación": { floor: "Planta Baja", direction: "izquierda", time: 2 },
    "registro": { floor: "Planta Baja", direction: "derecha", time: 1 },
    "cafetería": { floor: "2do Piso", direction: "derecho", time: 4 },
    "estacionamiento": { floor: "Afuera", direction: "salir y girar a la izquierda", time: 3 }
  },
  fr: {
    "urgence": { floor: "Rez-de-chaussée", direction: "droite", time: 2 },
    "cardiologie": { floor: "2ème Étage", direction: "gauche", time: 5 },
    "neurologie": { floor: "3ème Étage", direction: "droite", time: 7 },
    "radiologie": { floor: "Sous-sol", direction: "tout droit", time: 3 },
    "laboratoire": { floor: "Rez-de-chaussée", direction: "gauche", time: 3 },
    "pharmacie": { floor: "Rez-de-chaussée", direction: "tout droit", time: 2 },
    "facturation": { floor: "Rez-de-chaussée", direction: "gauche", time: 2 },
    "inscription": { floor: "Rez-de-chaussée", direction: "droite", time: 1 },
    "cafétéria": { floor: "2ème Étage", direction: "tout droit", time: 4 },
    "parking": { floor: "Extérieur", direction: "sortir et tourner à gauche", time: 3 }
  }
};

export function ChatBot({ isMinimized = false, onToggleMinimize }: ChatBotProps) {
  const { doctors, hospitals, appointments, homeVisitRequests } = useAppData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'es' | 'fr'>('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const speechRecognition = new (window as any).webkitSpeechRecognition();
      speechRecognition.continuous = false;
      speechRecognition.interimResults = false;
      speechRecognition.lang = currentLanguage === 'en' ? 'en-US' : currentLanguage === 'es' ? 'es-ES' : 'fr-FR';

      speechRecognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      speechRecognition.onerror = () => {
        setIsListening(false);
        toast.error(responses[currentLanguage].voiceError);
      };

      speechRecognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(speechRecognition);
    }
  }, [currentLanguage]);

  // Initialize with greeting
  useEffect(() => {
    if (messages.length === 0) {
      addBotMessage(responses[currentLanguage].greeting);
    }
  }, []);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content,
      timestamp: new Date(),
      language: currentLanguage
    };
    setMessages(prev => [...prev, message]);
    
    // Text-to-speech
    if ('speechSynthesis' in window && !isSpeaking) {
      speakMessage(content);
    }
  };

  const addUserMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
      language: currentLanguage
    };
    setMessages(prev => [...prev, message]);
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage === 'en' ? 'en-US' : currentLanguage === 'es' ? 'es-ES' : 'fr-FR';
      utterance.rate = 0.8;
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
      toast.success(responses[currentLanguage].voiceEnabled);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      toast.success(responses[currentLanguage].voiceDisabled);
    }
  };

  // Enhanced NLP Processing - Intent Recognition
  const processMessage = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    // Greeting patterns
    if (lowerMessage.match(/(hello|hi|hey|good morning|good afternoon|good evening|hola|bonjour)/)) {
      return responses[currentLanguage].greeting;
    }

    // Goodbye patterns
    if (lowerMessage.match(/(bye|goodbye|see you|thanks|thank you|gracias|merci|au revoir)/)) {
      return responses[currentLanguage].goodbye;
    }

    // Appointment booking patterns
    if (lowerMessage.match(/(book|schedule|appointment|cita|rendez-vous|doctor|médico|médecin)/)) {
      const availableDoctors = doctors.filter(d => d.isAvailable);
      const doctorList = availableDoctors.slice(0, 5).map(d => `• ${d.name} - ${d.specialty} (${d.hospital}) - ${d.consultationFee}`).join('\n');
      return `${responses[currentLanguage].appointmentBooked}\n\n🩺 **Available doctors:**\n${doctorList}\n\n💡 **Quick booking tip:** Use the 'Book Appointment' tab in the bottom menu for full scheduling!`;
    }

    // Doctor availability patterns
    if (lowerMessage.match(/(available|busy|free|doctor|disponible|libre|occupé|médico|médecin)/)) {
      const availableDoctors = doctors.filter(d => d.isAvailable);
      const busyDoctors = doctors.filter(d => !d.isAvailable);
      
      let response = `👨‍⚕️ **Doctor Availability Status:**\n\n`;
      response += `✅ **Available Now (${availableDoctors.length}):**\n`;
      availableDoctors.forEach(d => {
        const specialtyIcon = d.specialty === 'Cardiology' ? '❤️' : d.specialty === 'Neurology' ? '🧠' : d.specialty === 'Ophthalmology' ? '👁️' : '🩺';
        response += `${specialtyIcon} ${d.name} - ${d.specialty}\n`;
        response += `   🏥 ${d.hospital}\n`;
        response += `   ⭐ ${d.rating} rating\n`;
        response += `   💰 ${d.consultationFee}\n`;
        response += `   📅 Next slot: ${d.nextAvailable}\n\n`;
      });
      
      if (busyDoctors.length > 0) {
        response += `⏳ **Currently Unavailable (${busyDoctors.length}):**\n`;
        busyDoctors.forEach(d => {
          response += `• ${d.name} - ${d.specialty}\n`;
          response += `   📍 ${d.currentLocation || 'In consultation'}\n`;
          if (d.estimatedArrival) {
            response += `   🕐 ETA: ${d.estimatedArrival}\n`;
          }
          response += '\n';
        });
      }
      
      return response;
    }

    // Hospital navigation patterns
    if (lowerMessage.match(/(where|how to get|directions|find|location|navigate|dónde|cómo llegar|où|comment aller)/)) {
      const departments = hospitalDepartments[currentLanguage];
      const departmentNames = Object.keys(departments);
      
      // Check if specific department is mentioned
      const mentionedDept = departmentNames.find(dept => 
        lowerMessage.includes(dept) || 
        lowerMessage.includes(dept.replace(/ía|ie/g, 'ia').replace(/ción/g, 'tion'))
      );
      
      if (mentionedDept) {
        const dept = departments[mentionedDept as keyof typeof departments];
        return `🗺️ **Directions to ${mentionedDept.charAt(0).toUpperCase() + mentionedDept.slice(1)}:**\n\n` +
          `📍 **Location:** ${dept.floor}\n` +
          `⏱️ **Walking time:** ${dept.time} minutes from main entrance\n\n` +
          `**Step-by-step:**\n` +
          `1️⃣ Enter through Main Entrance\n` +
          `2️⃣ ${dept.floor === 'Ground Floor' ? 'Stay on ground floor' : `Take elevator to ${dept.floor}`}\n` +
          `3️⃣ Turn ${dept.direction} after exiting elevator\n` +
          `4️⃣ Follow signs for "${mentionedDept.charAt(0).toUpperCase() + mentionedDept.slice(1)}"\n\n` +
          `🚶‍♂️ **Accessibility:** All routes are wheelchair accessible\n` +
          `📞 **Need help?** Ask any staff member or use intercom stations`;
      }
      
      return `🏥 **Hospital Navigation Help**\n\nI can guide you to these departments:\n\n${departmentNames.map(d => {
        const icon = d === 'emergency' ? '🚨' : d === 'pharmacy' ? '💊' : d === 'laboratory' ? '🧪' : d === 'cardiology' ? '❤️' : d === 'neurology' ? '🧠' : d === 'radiology' ? '📱' : '🏥';
        return `${icon} ${d.charAt(0).toUpperCase() + d.slice(1)}`;
      }).join('\n')}\n\n💡 **Just ask:** "Where is [department name]?" and I'll give you detailed directions!\n\n🗺️ You can also use the **Map** tab for visual navigation.`;
    }

    // Billing patterns with integration
    if (lowerMessage.match(/(bill|billing|payment|cost|charge|insurance|factura|facturación|pago|costo|seguro|facture|paiement|coût|assurance)/)) {
      const billingRecords = BillingReportsService.getBillingRecords('Sarah Johnson');
      const billingResponse = BillingReportsService.formatBillingResponse(billingRecords);
      return billingResponse;
    }

    // Report status patterns with integration
    if (lowerMessage.match(/(report|result|test|lab|x-ray|scan|informe|resultado|prueba|laboratorio|rapport|résultat|examen)/)) {
      const reports = BillingReportsService.getReports('Sarah Johnson');
      const reportResponse = BillingReportsService.formatReportResponse(reports);
      return reportResponse;
    }

    // Wait time patterns with real-time data
    if (lowerMessage.match(/(wait|waiting|time|queue|espera|esperando|tiempo|attendre|attente|temps)/)) {
      let waitInfo = `⏰ **Real-time Hospital Wait Times:**\n\n`;
      hospitals.forEach(hospital => {
        const statusIcon = hospital.status === 'Low wait' ? '🟢' : hospital.status === 'Moderate wait' ? '🟡' : '🔴';
        waitInfo += `🏥 **${hospital.name}**\n`;
        waitInfo += `${statusIcon} Status: ${hospital.status}\n`;
        waitInfo += `⏱️ Current wait: ${hospital.waitTime}\n`;
        waitInfo += `📍 Distance: ${hospital.distance}\n`;
        waitInfo += `⭐ Rating: ${hospital.rating}/5\n\n`;
      });
      
      waitInfo += `📊 **Live Updates:** Wait times are updated every 5 minutes by hospital staff\n`;
      waitInfo += `💡 **Tip:** Book appointments in advance to avoid waiting!`;
      return waitInfo;
    }

    // Emergency patterns
    if (lowerMessage.match(/(emergency|urgent|help|911|emergencia|urgente|ayuda|urgence|aide)/)) {
      return `🚨 **Emergency Information:**\n\n` +
        `**Life-threatening emergencies:**\n` +
        `• Call 911 immediately\n` +
        `• Go directly to Emergency Department\n` +
        `• Location: Ground Floor, turn right from main entrance\n` +
        `• Open 24/7\n\n` +
        `🏃‍♂️ **Current Emergency Status:**\n` +
        `• Wait time: 15-20 minutes\n` +
        `• Triage nurse available immediately\n\n` +
        `🩺 **Non-emergency urgent care:**\n` +
        `• Urgent Care Clinic (Ground Floor)\n` +
        `• Current wait: 15-30 minutes\n` +
        `• Walk-ins welcome\n\n` +
        `📞 **Emergency Contacts:**\n` +
        `• Hospital Emergency: (555) 911-HELP\n` +
        `• Poison Control: 1-800-222-1222`;
    }

    // Language patterns
    if (lowerMessage.match(/(language|idioma|langue|english|español|français|spanish|french)/)) {
      return `🌐 **Language Support Available:**\n\n` +
        `🇺🇸 **English** - Full support\n` +
        `🇪🇸 **Español** - Soporte completo\n` +
        `🇫🇷 **Français** - Support complet\n\n` +
        `💡 **How to change language:**\n` +
        `Select your preferred language from the dropdown menu above!\n\n` +
        `👥 **Human interpreters also available:**\n` +
        `• Request at registration desk\n` +
        `• Available for appointments\n` +
        `• Sign language support available`;
    }

    // My appointments/visits patterns
    if (lowerMessage.match(/(my|mi|mes|appointment|cita|rendez-vous|visit|visita|visite)/)) {
      let response = `📅 **Your Healthcare Summary:**\n\n`;
      
      const userAppointments = appointments.filter(a => a.patientName === 'Sarah Johnson').slice(0, 3);
      const userHomeVisits = homeVisitRequests.filter(h => h.patientName === 'Sarah Johnson' || h.patientName === 'John Smith').slice(0, 2);
      
      if (userAppointments.length > 0) {
        response += `🏥 **Upcoming Appointments (${userAppointments.length}):**\n`;
        userAppointments.forEach(apt => {
          const statusIcon = apt.status === 'Confirmed' ? '✅' : apt.status === 'Pending' ? '⏳' : '📋';
          response += `${statusIcon} ${apt.doctorName} - ${apt.specialty}\n`;
          response += `   📅 ${apt.date} at ${apt.time}\n`;
          response += `   🏥 ${apt.hospital}\n`;
          response += `   📱 Status: ${apt.status}\n`;
          if (apt.waitTime) {
            response += `   ⏰ Est. wait: ${apt.waitTime}\n`;
          }
          response += '\n';
        });
      }
      
      if (userHomeVisits.length > 0) {
        response += `🏠 **Home Visit Requests (${userHomeVisits.length}):**\n`;
        userHomeVisits.forEach(visit => {
          const statusIcon = visit.status === 'Accepted' ? '✅' : visit.status === 'In Transit' ? '🚗' : '⏳';
          response += `${statusIcon} ${visit.status} - ${visit.urgency} priority\n`;
          response += `   📍 ${visit.address}\n`;
          response += `   📅 ${visit.preferredTime}\n`;
          if (visit.assignedDoctor) {
            response += `   👨‍⚕️ Dr. ${visit.assignedDoctor.name}\n`;
          }
          if (visit.estimatedArrival) {
            response += `   🕐 ETA: ${visit.estimatedArrival}\n`;
          }
          response += '\n';
        });
      }
      
      if (userAppointments.length === 0 && userHomeVisits.length === 0) {
        response += `📝 **No active appointments or visits**\n\n`;
        response += `💡 **Quick actions:**\n`;
        response += `• Book a new appointment\n`;
        response += `• Request a home visit\n`;
        response += `• Find available doctors`;
      }
      
      return response;
    }

    // Default response
    return responses[currentLanguage].notUnderstood;
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      addUserMessage(inputMessage.trim());
      const botResponse = processMessage(inputMessage.trim());
      setTimeout(() => addBotMessage(botResponse), 500);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: string, query: string) => {
    addUserMessage(action);
    setTimeout(() => addBotMessage(processMessage(query)), 500);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleMinimize}
          className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg animate-pulse"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] z-50">
      <Card className="h-[600px] flex flex-col shadow-2xl border-2 border-blue-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-medium">CureQueue AI Assistant</h3>
              <p className="text-xs opacity-90">Multilingual healthcare support</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={currentLanguage} onValueChange={(value: 'en' | 'es' | 'fr') => setCurrentLanguage(value)}>
              <SelectTrigger className="w-16 h-8 bg-blue-500 border-blue-400 text-white text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇺🇸 EN</SelectItem>
                <SelectItem value="es">🇪🇸 ES</SelectItem>
                <SelectItem value="fr">🇫🇷 FR</SelectItem>
              </SelectContent>
            </Select>
            {onToggleMinimize && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleMinimize}
                className="text-white hover:bg-blue-500 w-8 h-8 p-0"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Bot className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 opacity-70`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Quick Actions */}
        <div className="p-2 border-t bg-gray-50">
          <div className="flex gap-1 mb-2 overflow-x-auto pb-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAction("Show available doctors", "available doctors")}
              className="text-xs whitespace-nowrap"
            >
              <Stethoscope className="w-3 h-3 mr-1" />
              Doctors
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAction("Book appointment", "book appointment")}
              className="text-xs whitespace-nowrap"
            >
              <Calendar className="w-3 h-3 mr-1" />
              Book
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAction("Hospital navigation", "where is emergency")}
              className="text-xs whitespace-nowrap"
            >
              <MapPin className="w-3 h-3 mr-1" />
              Map
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAction("Check wait times", "wait times")}
              className="text-xs whitespace-nowrap"
            >
              <Clock className="w-3 h-3 mr-1" />
              Wait Times
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAction("My billing", "billing status")}
              className="text-xs whitespace-nowrap"
            >
              <CreditCard className="w-3 h-3 mr-1" />
              Billing
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAction("My reports", "report status")}
              className="text-xs whitespace-nowrap"
            >
              <FileText className="w-3 h-3 mr-1" />
              Reports
            </Button>
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask me anything... (${currentLanguage.toUpperCase()})`}
                className="pr-12"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                {isSpeaking ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={stopSpeaking}
                    className="w-6 h-6 p-0 text-orange-600"
                  >
                    <VolumeX className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => speakMessage(messages[messages.length - 1]?.content || '')}
                    className="w-6 h-6 p-0 text-gray-500"
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            <Button
              size="sm"
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? "default" : "outline"}
              className={`w-10 h-10 p-0 ${isListening ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' : ''}`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button size="sm" onClick={handleSendMessage} className="w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center justify-center mt-2">
            <Badge variant="outline" className="text-xs text-gray-500">
              <Activity className="w-3 h-3 mr-1" />
              AI-powered • Voice enabled • Real-time data
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}